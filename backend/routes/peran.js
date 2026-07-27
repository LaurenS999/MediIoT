const express = require("express");
const router = express.Router();
const db = require("../db.js");

const { buildMeasurementData } = require("../helpers/pengukuranHelper.js");
const auth = require("../middleware/auth.js");
const allow = require("../middleware/permission");
const createAuditLog = require("../utils/auditLogs");

router.get("/", async (req, res) => {
  try {
    const keyword = req.query.search || "";

    const values = [];
    // =========================
    // DATA QUERY
    // =========================
    let sql = `
      SELECT *
        FROM peran
        where nama != "super admin"
        order by id_peran
    `;

    const [result] = await db.query(sql, [...values]);

    res.status(200).json({
      success: true,
      message: "Data Peran berhasil diambil",
      data: result,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

//Create PASIEN
router.post("/", auth, allow("peran.create"), async (req, res) => {
  try {
    const { nama } = req.body;

    // =========================
    // VALIDASI FIELD WAJIB
    // =========================
    if (!nama?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nama pasien wajib diisi",
      });
    }

    // =========================
    // DEFAULT VALUE
    // =========================
    const peranNama = {
      nama: nama.trim(),
    };

    // =========================
    // INSERT DATABASE
    // =========================
    await db.query(
      `
      INSERT INTO peran (
        nama,
      )
      VALUES (?)
      `,
      [peranNama],
    );

    await createAuditLog({
      id_user: id_user,
      action: "CREATE PERAN",
    });

    res.json({
      success: true,
      message: "Peran berhasil ditambahkan",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// EDIT PASIEN
router.put("/:id_peran", auth, allow("peran.update"), async (req, res) => {
  try {
    const { id_pasien } = req.params;

    const {
      nama,
      alamat,
      tanggal_lahir,
      tempat_lahir,
      jenis_kelamin,
      email,
      no_telp,
    } = req.body;

    if (!nama || !alamat || !tanggal_lahir || !tempat_lahir || !jenis_kelamin) {
      return res.status(400).json({
        success: false,
        message: "Data utama tidak boleh kosong",
      });
    }

    const [rows] = await db.query(
      `SELECT
          nama,
          alamat,
          DATE_FORMAT(tanggal_lahir, '%Y-%m-%d') AS tanggal_lahir,
          tempat_lahir,
          jenis_kelamin,
          email,
          no_telp
        FROM pasien
        WHERE id_pasien = ? AND status_delete = 0`,
      [id_pasien],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data pasien tidak ditemukan",
      });
    }

    const pasien = rows[0];

    const statusBerubah =
      nama !== pasien.nama ||
      alamat !== pasien.alamat ||
      tanggal_lahir !== pasien.tanggal_lahir ||
      tempat_lahir !== pasien.tempat_lahir ||
      jenis_kelamin !== pasien.jenis_kelamin ||
      email !== pasien.email ||
      no_telp !== pasien.no_telp;

    if (!statusBerubah) {
      return res.status(200).json({
        success: false,
        message: "Tidak ada data yang berubah",
      });
    }

    const [result] = await db.query(
      `
        UPDATE pasien
        SET
          nama=?,
          alamat=?,
          tanggal_lahir=?,
          tempat_lahir=?,
          jenis_kelamin=?,
          email=?,
          no_telp=?
        WHERE id_pasien=? AND status_delete = 0
        `,
      [
        nama,
        alamat,
        tanggal_lahir,
        tempat_lahir,
        jenis_kelamin,
        email,
        no_telp,
        id_pasien,
      ],
    );

    // AUDIT LOG
    await createAuditLog({
      id_user: req.user.id_user,
      action: `UPDATE_PASIEN_${id_pasien}`,
    });

    res.status(200).json({
      success: true,
      message: "Data pasien berhasil diubah",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

router.delete(
  "/:id_peran/:id_user",
  auth,
  allow("peran.delete"),
  async (req, res) => {
    try {
      const { id_pasien, id_user } = req.params;

      const [result] = await db.query(
        `
        UPDATE pasien
        SET status_delete = 1
        WHERE id_pasien = ? AND status_delete = 0
        `,
        [id_pasien],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Data pasien tidak ditemukan",
        });
      }

      // AUDIT LOG
      await createAuditLog({
        id_user: req.user.id_user,
        action: `DELETE_PASIEN_${id_pasien}`,
      });

      res.status(200).json({
        success: true,
        message: "Data pasien berhasil dihapus",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
      });
    }
  },
);
module.exports = router;
