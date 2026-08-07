const express = require("express");
const router = express.Router();

const db = require("../db");

const auth = require("../middleware/auth");
const allow = require("../middleware/permission");

const createAuditLog = require("../utils/auditLogs");

const {
  generateKodePemeriksaan,
  generateKodePengukuran,
  generateKodeKunjungan,
} = require("../helpers/generatePengukuran");

const parseJSON = require("../helpers/parseJSON.js");
const upload = require("../middleware/uploadLampiran.js");

const fs = require("fs");
const path = require("path");
const kategoriValid = ["photo", "laboratory", "radiology", "ecg", "other"];

router.post(
  "/",
  auth,
  allow("kunjungan.create"),
  upload.array("files", 10),
  async (req, res) => {
    const conn = await db.getConnection();

    try {
      // ==========================================
      // PARSE REQUEST
      // ==========================================

      const patient = parseJSON(req.body.patient, {});
      const devices = parseJSON(req.body.devices, []);
      const liveData = parseJSON(req.body.liveData, {});
      const bmiResult = parseJSON(req.body.bmiResult, null);

      const {
        tinggiBadan,
        keluhan,
        catatanPemeriksaan,
        waktu_kunjungan_awal,
        butuh_observasi,
      } = req.body;

      // FormData selalu mengirim value sebagai string
      const butuhObservasi = butuh_observasi === "true";

      let kategoriData = req.body.kategori ?? [];

      if (!Array.isArray(kategoriData)) {
        kategoriData = [kategoriData];
      }

      console.log("REQUEST BODY : ", req.body);
      console.log("BUTUH OBSERVASI : ", butuhObservasi);

      // ==========================================
      // VALIDASI PASIEN
      // ==========================================

      if (!patient || !patient.id_pasien) {
        return res.status(400).json({
          success: false,
          message: "Pasien wajib dipilih",
        });
      }

      // ==========================================
      // VALIDASI FILE DAN KATEGORI
      // ==========================================

      if (req.files.length !== kategoriData.length) {
        throw new Error("Jumlah file dan kategori tidak sesuai");
      }

      // ==========================================
      // CEK PASIEN
      // ==========================================

      const [pasien] = await conn.query(
        `
          SELECT id_pasien
          FROM pasien
          WHERE id_pasien = ?
            AND status_delete = 0
        `,
        [patient.id_pasien],
      );

      if (pasien.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pasien tidak ditemukan",
        });
      }

      // ==========================================
      // BEGIN TRANSACTION
      // ==========================================

      await conn.beginTransaction();

      let id_pemeriksaan = null;
      let id_pengukuran = null;

      // ==========================================
      // INSERT SESI PEMERIKSAAN
      // ==========================================

      const kodePemeriksaan = await generateKodePemeriksaan(conn);

      const [insertPemeriksaan] = await conn.query(
        `
          INSERT INTO sesi_pemeriksaan
          (
            kode_pemeriksaan,
            keluhan,
            catatan_perawat
          )
          VALUES
          (
            ?,
            ?,
            ?
          )
        `,
        [kodePemeriksaan, keluhan, catatanPemeriksaan],
      );

      id_pemeriksaan = insertPemeriksaan.insertId;

      // ==========================================
      // CEK ADA DATA PENGUKURAN
      // ==========================================

      const hasPengukuran =
        Array.isArray(devices) &&
        devices.length > 0 &&
        liveData &&
        Object.keys(liveData).length > 0;

      if (hasPengukuran) {
        const kodePengukuran = await generateKodePengukuran(conn);

        const [insertPengukuran] = await conn.query(
          `
            INSERT INTO sesi_pengukuran
            (
              kode_pengukuran
            )
            VALUES
            (
              ?
            )
          `,
          [kodePengukuran],
        );

        id_pengukuran = insertPengukuran.insertId;
      }

      // ==========================================
      // HARUS ADA PEMERIKSAAN ATAU PENGUKURAN
      // ==========================================

      if (!id_pemeriksaan && !id_pengukuran) {
        await conn.rollback();

        return res.status(400).json({
          success: false,
          message:
            "Tidak ada data pemeriksaan maupun pengukuran yang disimpan.",
        });
      }

      // ==========================================
      // GENERATE KODE KUNJUNGAN
      // ==========================================

      const kodeKunjungan = await generateKodeKunjungan(
        conn,
        patient.id_pasien,
      );

      // ==========================================
      // INSERT KUNJUNGAN
      // ==========================================

      const [insertKunjungan] = await conn.query(
        `
          INSERT INTO kunjungan
          (
            kode_kunjungan,
            id_pasien,
            id_pengukuran,
            id_pemeriksaan,
            id_perawat,
            id_dokter
          )
          VALUES
          (
            ?,
            ?,
            ?,
            ?,
            ?,
            NULL
          )
        `,
        [
          kodeKunjungan,
          patient.id_pasien,
          id_pengukuran,
          id_pemeriksaan,
          req.user.id_user,
        ],
      );

      const id_kunjungan = insertKunjungan.insertId;

      // ==========================================
      // CEK PERMINTAAN PEMERIKSAAN HARI INI
      // ==========================================

      const [permintaan] = await conn.query(
        `
          SELECT
            id_permintaan_pemeriksaan
          FROM permintaan_pemeriksaan
          WHERE id_pasien = ?
            AND DATE(tanggal_pemeriksaan) = CURDATE()
            AND status = 'menunggu pemeriksaan'
          LIMIT 1
        `,
        [patient.id_pasien],
      );

      // ==========================================
      // UPDATE PERMINTAAN PEMERIKSAAN
      // ==========================================

      if (permintaan.length > 0) {
        const id_permintaan_pemeriksaan =
          permintaan[0].id_permintaan_pemeriksaan;

        // ========================================
        // VALIDASI WAKTU KUNJUNGAN AWAL
        // ========================================

        if (!waktu_kunjungan_awal) {
          await conn.rollback();

          return res.status(400).json({
            success: false,
            message:
              "Waktu kunjungan awal wajib diisi untuk permintaan pemeriksaan",
          });
        }

        // ========================================
        // PASIEN MEMBUTUHKAN OBSERVASI
        // ========================================

        if (butuhObservasi) {
          await conn.query(
            `
              UPDATE permintaan_pemeriksaan
              SET
                status = 'observasi',
                waktu_kunjungan_awal = ?,
                diubah_pada = NOW()
              WHERE id_permintaan_pemeriksaan = ?
            `,
            [waktu_kunjungan_awal, id_permintaan_pemeriksaan],
          );
        }

        // ========================================
        // PASIEN TIDAK MEMBUTUHKAN OBSERVASI
        // ========================================
        else {
          await conn.query(
            `
              UPDATE permintaan_pemeriksaan
              SET
                status = 'selesai',
                waktu_kunjungan_awal = ?,
                waktu_kunjungan_akhir = NOW(),
                diubah_pada = NOW()
              WHERE id_permintaan_pemeriksaan = ?
            `,
            [waktu_kunjungan_awal, id_permintaan_pemeriksaan],
          );
        }
      }

      // ==========================================
      // INSERT LAMPIRAN
      // ==========================================

      let lampiranBerhasil = false;
      let jumlahLampiran = 0;

      if (req.files && req.files.length > 0) {
        if (!Array.isArray(kategoriData)) {
          kategoriData = [kategoriData];
        }

        if (kategoriData.length !== req.files.length) {
          throw new Error("Jumlah kategori dan file tidak sesuai");
        }

        const nomorKategori = {};

        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          const kategori = kategoriData[i];

          // ========================================
          // VALIDASI KATEGORI
          // ========================================

          if (!kategoriValid.includes(kategori)) {
            throw new Error(`Kategori tidak valid : ${kategori}`);
          }

          // ========================================
          // AMBIL NOMOR FILE BERIKUTNYA
          // ========================================

          if (nomorKategori[kategori] === undefined) {
            const [[total]] = await conn.query(
              `
                SELECT COUNT(*) AS jumlah
                FROM kunjungan_lampiran
                WHERE id_kunjungan = ?
                  AND kategori = ?
              `,
              [id_kunjungan, kategori],
            );

            nomorKategori[kategori] = total.jumlah;
          }

          nomorKategori[kategori]++;

          // ========================================
          // NAMA FILE
          // ========================================

          const ext = path.extname(file.originalname).toLowerCase();

          const namaFile =
            `L-${kodeKunjungan}-${kategori}-` +
            `${String(nomorKategori[kategori]).padStart(2, "0")}${ext}`;

          // ========================================
          // INSERT LAMPIRAN
          // ========================================

          await conn.query(
            `
              INSERT INTO kunjungan_lampiran
              (
                id_kunjungan,
                kategori,
                nama_file,
                path_file,
                mime_type,
                ukuran_file
              )
              VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
              id_kunjungan,
              kategori,
              namaFile,
              file.filename,
              file.mimetype,
              file.size,
            ],
          );

          jumlahLampiran++;
        }

        if (jumlahLampiran === req.files.length) {
          lampiranBerhasil = true;
        }
      }

      // ==========================================
      // COMMIT
      // ==========================================

      await conn.commit();

      // ==========================================
      // AUDIT LOG
      // ==========================================

      await createAuditLog({
        id_user: req.user.id_user,
        action: `CREATE_KUNJUNGAN_${kodeKunjungan}`,
      });

      // ==========================================
      // RESPONSE
      // ==========================================

      return res.status(201).json({
        success: true,
        message: "Data berhasil disimpan",

        data: {
          id_kunjungan,
          kode_kunjungan: kodeKunjungan,

          id_pemeriksaan,
          id_pengukuran,

          lampiran: {
            berhasil: lampiranBerhasil,
            jumlah: jumlahLampiran,
          },
        },
      });
    } catch (error) {
      // ==========================================
      // ROLLBACK
      // ==========================================

      await conn.rollback();

      console.error(error);

      // ==========================================
      // HAPUS FILE JIKA TRANSACTION GAGAL
      // ==========================================

      if (req.files) {
        for (const file of req.files) {
          const filePath = path.join(
            __dirname,
            "../uploads/kunjungan",
            file.filename,
          );

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    } finally {
      // ==========================================
      // RELEASE CONNECTION
      // ==========================================

      conn.release();
    }
  },
);

module.exports = router;
