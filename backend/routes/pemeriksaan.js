const express = require("express");
const router = express.Router();

const db = require("../db");
const auth = require("../middleware/auth");
const allow = require("../middleware/permission");
const createAuditLog = require("../utils/auditLogs");

// ======================================================
// CREATE SESI pemeriksaan
// ======================================================
router.post("/", auth, allow("pemeriksaan.create"), async (req, res) => {
  try {
    const { keluhan, catatan_perawat } = req.body;

    console.log("REQUEST BODY : ", req.body);

    // ==================================================
    // FORMAT TANGGAL
    // ==================================================
    const today = new Date();

    const yyyy = today.getFullYear();

    const mm = String(today.getMonth() + 1).padStart(2, "0");

    const dd = String(today.getDate()).padStart(2, "0");

    const tanggal = `${yyyy}${mm}${dd}`;

    // ==================================================
    // HITUNG JUMLAH DATA HARI INI
    // ==================================================
    const sqlCount = `
      SELECT COUNT(*) as total
      FROM sesi_pemeriksaan
      WHERE DATE(dibuat_pada) = CURDATE()
    `;

    const [countResult] = await db.query(sqlCount);

    const urutan = countResult[0].total + 1;

    // 0001
    const nomorUrut = String(urutan).padStart(4, "0");

    // SESI-20260506-0001
    const kode_pemeriksaan = `PM-${tanggal}-${nomorUrut}`;

    // ==================================================
    // INSERT DATA
    // ==================================================
    const sqlInsert = `
      INSERT INTO sesi_pemeriksaan
      (
        kode_pemeriksaan,
        keluhan,
        catatan_perawat
      )
      VALUES (?, ?, ?)
    `;

    const [insertResult] = await db.query(sqlInsert, [
      kode_pemeriksaan,
      keluhan,
      catatan_perawat,
    ]);

    await createAuditLog({
      id_user: req.user.id_user,
      action: `CREATE pemeriksaan ` + req.user.id_user,
    });

    res.status(201).json({
      success: true,
      message: "Sesi pemeriksaan berhasil dibuat",
      insertId: insertResult.insertId,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ======================================================
// UPDATE SESI pemeriksaan
// ======================================================
router.put("/:id", auth, allow("pemeriksaan.update"), async (req, res) => {
  const conn = await db.getConnection();

  try {
    const { id } = req.params;

    const { diagnosa, catatan_dokter, status_pasien } = req.body;

    // =========================
    // VALIDASI
    // =========================
    if (!status_pasien) {
      return res.status(400).json({
        success: false,
        message: "Status pasien wajib diisi",
      });
    }

    await conn.beginTransaction();

    // =========================
    // CEK SESI PEMERIKSAAN
    // =========================
    const [pemeriksaan] = await conn.query(
      `
      SELECT id_pemeriksaan
      FROM sesi_pemeriksaan
      WHERE id_pemeriksaan = ?
      `,
      [id],
    );

    if (pemeriksaan.length === 0) {
      await conn.rollback();

      return res.status(404).json({
        success: false,
        message: "Sesi pemeriksaan tidak ditemukan",
      });
    }

    // =========================
    // UPDATE SESI PEMERIKSAAN
    // =========================
    await conn.query(
      `
      UPDATE sesi_pemeriksaan
      SET
        diagnosa = ?,
        catatan_dokter = ?,
        status_pasien = ?
      WHERE id_pemeriksaan = ?
      `,
      [diagnosa || null, catatan_dokter || null, status_pasien, id],
    );

    // =========================
    // UPDATE DOKTER DI KUNJUNGAN
    // =========================
    const [result] = await conn.query(
      `
      UPDATE kunjungan
      SET
        id_dokter = ?
      WHERE id_pemeriksaan = ?
      `,
      [req.user.id_user, id],
    );

    if (result.affectedRows === 0) {
      await conn.rollback();

      return res.status(404).json({
        success: false,
        message: "Data kunjungan tidak ditemukan",
      });
    }

    // =========================
    // AUDIT LOG
    // =========================
    await createAuditLog({
      id_user: req.user.id_user,
      action: `UPDATE_PEMERIKSAAN_${id}`,
    });

    await conn.commit();

    res.status(200).json({
      success: true,
      message: "Sesi pemeriksaan berhasil diperbarui",
    });
  } catch (error) {
    await conn.rollback();

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Gagal update sesi pemeriksaan",
    });
  } finally {
    conn.release();
  }
});

// ======================================================
// DELETE SESI PEMERIKSAAN
// ======================================================
router.delete("/:id", auth, allow("pemeriksaan.delete"), async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      DELETE FROM sesi_pemeriksaan
      WHERE id_pemeriksaan = ?
    `;

    await db.query(sql, [id]);

    res.json({
      success: true,
      message: "Sesi pemeriksaan berhasil dihapus",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Gagal menghapus sesi pemeriksaan",
    });
  }
});

//GET DETAIL PASIEN di HALAMAN PEMERIKSAAN AWAL
router.get(
  "/:id/pasien",
  auth,
  allow("pasien.detail.read"),
  async (req, res) => {
    try {
      const id = req.params.id;

      // ================================
      // DATA PASIEN
      // ================================
      const [pasien] = await db.query(
        `
          SELECT
            id_pasien,
            kode_pasien,
            nama,
            DATE_FORMAT(tanggal_lahir, '%Y-%m-%d') AS tanggal_lahir,
            jenis_kelamin,
            dibuat_pada AS tanggal_pendaftaran
          FROM pasien
          WHERE id_pasien = ? AND status_delete = 0
        `,
        [id],
      );

      if (pasien.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pasien tidak ditemukan",
        });
      }

      // ================================
      // CEK PERMINTAAN PEMERIKSAAN AKTIF
      // ================================
      const [permintaan] = await db.query(
        `
          SELECT id_permintaan_pemeriksaan
          FROM permintaan_pemeriksaan
          WHERE id_pasien = ?
            AND DATE(tanggal_pemeriksaan) = CURDATE()
            AND status = 'menunggu pemeriksaan'
          LIMIT 1
        `,
        [id],
      );

      const permintaanPemeriksaanAktif = permintaan.length > 0;
      res.json({
        success: true,
        data: {
          pasien: pasien[0],
          permintaanPemeriksaanAktif,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

module.exports = router;
