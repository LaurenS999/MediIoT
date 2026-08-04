const express = require("express");
const router = express.Router();

const { buildMeasurementData } = require("../helpers/pengukuranHelper.js");

const db = require("../db");
const auth = require("../middleware/auth");
const allow = require("../middleware/permission");
const createAuditLog = require("../utils/auditLogs");

router.get(
  "/tunggu-dokter",
  auth,
  allow("pemeriksaan_dokter.read"),
  async (req, res) => {
    try {
      const keyword = req.query.search || "";

      // =========================
      // PAGINATION
      // =========================
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const values = [];

      // =========================
      // COUNT QUERY
      // =========================
      let countSql = `
        SELECT COUNT(*) AS total

        FROM sesi_pemeriksaan sp

        INNER JOIN kunjungan k
          ON k.id_pemeriksaan = sp.id_pemeriksaan

        INNER JOIN pasien p
          ON p.id_pasien = k.id_pasien

        INNER JOIN user u
          ON u.id_user = k.id_perawat

        WHERE k.id_dokter IS NULL
      `;

      // =========================
      // DATA QUERY
      // =========================
      let sql = `
        SELECT
          k.id_kunjungan,
          k.tanggal_pemeriksaan_awal,
          k.tanggal_pemeriksaan_dokter,

          sp.id_pemeriksaan,
          sp.kode_pemeriksaan,
          sp.dibuat_pada,
          sp.keluhan,
          sp.diagnosa,
          sp.catatan_dokter,
          sp.status_pasien,
          sp.catatan_perawat,

          p.id_pasien,
          p.kode_pasien,
          p.nama,

          u.username AS nama_perawat

        FROM sesi_pemeriksaan sp

        INNER JOIN kunjungan k
          ON k.id_pemeriksaan = sp.id_pemeriksaan

        INNER JOIN pasien p
          ON p.id_pasien = k.id_pasien

        INNER JOIN user u
          ON u.id_user = k.id_perawat

        WHERE k.id_dokter IS NULL
      `;

      // =========================
      // SEARCH
      // =========================
      if (keyword.trim() !== "") {
        countSql += `
          AND (
            p.nama LIKE ?
            OR u.username LIKE ?
          )
        `;

        sql += `
          AND (
            p.nama LIKE ?
            OR u.username LIKE ?
          )
        `;

        values.push(`%${keyword}%`);
        values.push(`%${keyword}%`);
      }

      // =========================
      // TOTAL DATA
      // =========================
      const [countRows] = await db.query(countSql, values);

      const totalData = countRows[0].total;
      const totalPage = Math.ceil(totalData / limit);

      // =========================
      // FINAL QUERY
      // =========================
      sql += `
        ORDER BY sp.kode_pemeriksaan DESC
        LIMIT ? OFFSET ?
      `;

      const [rows] = await db.query(sql, [...values, limit, offset]);

      res.status(200).json({
        success: true,
        message:
          "Berhasil mengambil daftar sesi yang menunggu pemeriksaan dokter.",
        pagination: {
          page,
          limit,
          totalData,
          totalPage,
        },
        // data: [],
        data: rows,
      });
    } catch (error) {
      console.log(error);

      if (error.code == "ECONNREFUSED") {
        return res.status(500).json({
          success: false,
          message: "Server tidak terjangkau",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

router.get(
  "/:id_kunjungan",
  auth,
  allow("pemeriksaan_dokter.read"),
  async (req, res) => {
    try {
      const { id_kunjungan } = req.params;

      // ==================================================
      // DETAIL SESI + PASIEN
      // ==================================================
      const sqlSesi = `
        SELECT
            k.tanggal_pemeriksaan_awal,
            k.tanggal_pemeriksaan_dokter,
            k.kode_kunjungan,
            sp.id_pemeriksaan,
            sp.kode_pemeriksaan,
            sp.dibuat_pada,
            COALESCE(sp.keluhan, '') AS keluhan,
            COALESCE(sp.catatan_perawat, '') AS catatan_perawat,

            p.id_pasien AS id_pasien,
            p.kode_pasien,
            p.nama,
            p.tanggal_lahir,
            p.jenis_kelamin,

            u.username AS nama_perawat,

            k.id_pengukuran

        FROM sesi_pemeriksaan sp

        INNER JOIN kunjungan k
            ON k.id_pemeriksaan = sp.id_pemeriksaan

        INNER JOIN pasien p
            ON p.id_pasien = k.id_pasien

        INNER JOIN user u
            ON u.id_user = k.id_perawat

        WHERE
            k.id_kunjungan = ?
            AND k.id_dokter IS NULL

        LIMIT 1;
      `;

      const [sesiRows] = await db.query(sqlSesi, [id_kunjungan]);

      if (sesiRows.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Sesi Pemeriksaan tidak ditemukan atau sudah diperiksa dokter.",
        });
      }

      const sesi = sesiRows[0];

      let pengukuran = await buildMeasurementData(sesi.id_pengukuran);

      if (!pengukuran) {
        pengukuran = [];
      }
      // ==================================================
      // RESPONSE
      // ==================================================
      res.status(200).json({
        success: true,
        message: "Berhasil mengambil detail pemeriksaan dokter.",
        data: {
          pasien: {
            id: sesi.id_pasien,
            kode_pasien: sesi.kode_pasien,
            nama_pasien: sesi.nama,
            tanggal_lahir: sesi.tanggal_lahir,
            jenis_kelamin: sesi.jenis_kelamin,
            nama_perawat: sesi.nama_perawat,
            kode_kunjungan: sesi.kode_kunjungan,
          },

          sesi: {
            id_pemeriksaan: sesi.id_pemeriksaan,
            kode_pemeriksaan: sesi.kode_pemeriksaan,
            dibuat_pada: sesi.dibuat_pada,
            keluhan: sesi.keluhan,
            catatan_perawat: sesi.catatan_perawat,
          },

          pengukuran,
        },
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

router.put(
  "/:id_pemeriksaan/pemeriksaan-dokter",
  auth,
  allow("pemeriksaan_dokter.update"),
  async (req, res) => {
    const conn = await db.getConnection();

    try {
      const { id_pemeriksaan } = req.params;

      const { diagnosa, catatan_dokter, status_pasien } = req.body;

      // =========================
      // VALIDASI
      // =========================
      if (!status_pasien) {
        return res.status(400).json({
          success: false,
          message: "Status pasien wajib diisi.",
        });
      }

      await conn.beginTransaction();

      // =========================
      // CEK DATA PEMERIKSAAN
      // =========================
      const [check] = await conn.query(
        `
        SELECT pm.id_pemeriksaan, k.id_kunjungan
        FROM sesi_pemeriksaan pm
          inner join kunjungan k on pm.id_pemeriksaan = k.id_pemeriksaan
        WHERE pm.id_pemeriksaan = ?
        `,
        [id_pemeriksaan],
      );

      if (check.length === 0) {
        await conn.rollback();

        return res.status(404).json({
          success: false,
          message: "Sesi pemeriksaan tidak ditemukan.",
        });
      }

      const id_kunjungan = check[0].id_kunjungan;

      // =========================
      // UPDATE PEMERIKSAAN
      // =========================
      const [result] = await conn.query(
        `
        UPDATE sesi_pemeriksaan
        SET
          diagnosa = ?,
          catatan_dokter = ?,
          status_pasien = ?
        WHERE id_pemeriksaan = ?
        `,
        [
          diagnosa || null,
          catatan_dokter || null,
          status_pasien,
          id_pemeriksaan,
        ],
      );

      if (result.affectedRows === 0) {
        await conn.rollback();

        return res.status(404).json({
          success: false,
          message: "Gagal mengupdate sesi pemeriksaan.",
        });
      }

      // =========================
      // UPDATE DOKTER PADA KUNJUNGAN
      // =========================
      const [kunjungan] = await conn.query(
        `
          UPDATE kunjungan
          SET
            id_dokter = ?,
            tanggal_pemeriksaan_dokter = NOW()
          WHERE id_kunjungan = ?
          `,
        [req.user.id_user, id_kunjungan],
      );

      if (kunjungan.affectedRows === 0) {
        await conn.rollback();

        return res.status(404).json({
          success: false,
          message: "Data kunjungan tidak ditemukan.",
        });
      }

      // =========================
      // AUDIT LOG
      // =========================
      await createAuditLog({
        id_user: req.user.id_user,
        action: `UPDATE PEMERIKSAAN DOKTER SESI ${id_pemeriksaan}`,
      });

      await conn.commit();

      res.status(200).json({
        success: true,
        message: "Pemeriksaan dokter berhasil disimpan.",
      });
    } catch (error) {
      await conn.rollback();

      console.error(error);

      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    } finally {
      conn.release();
    }
  },
);

module.exports = router;
