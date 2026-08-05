const express = require("express");
const router = express.Router();
const db = require("../db.js");

const { buildMeasurementData } = require("../helpers/pengukuranHelper.js");
const auth = require("../middleware/auth.js");
const allow = require("../middleware/permission");
const createAuditLog = require("../utils/auditLogs");

//GET DATA PASIEN DENGAN PAGINATION
router.get("/", async (req, res) => {
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
      FROM pasien
      WHERE status_delete = 0
    `;

    // =========================
    // DATA QUERY
    // =========================
    let sql = `
      SELECT
        pasien.id_pasien,
        pasien.kode_pasien,
        pasien.nama,
        pasien.jenis_kelamin,
        pasien.tanggal_lahir,
        pasien.no_telp,
        pasien.alamat,

        COALESCE(
          MAX(kunjungan.dibuat_pada),
          NULL
        ) AS kunjungan_terakhir

      FROM pasien

      LEFT JOIN kunjungan
        ON pasien.id_pasien = kunjungan.id_pasien

      WHERE pasien.status_delete = 0
    `;

    if (keyword.trim() !== "") {
      countSql += `
        AND (
          pasien.nama LIKE ?
          OR pasien.kode_pasien LIKE ?
        )
      `;

      sql += `
        AND (
          pasien.nama LIKE ?
          OR pasien.kode_pasien LIKE ?
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
      GROUP BY pasien.id_pasien
      ORDER BY pasien.id_pasien DESC
      LIMIT ? OFFSET ?
    `;

    const [result] = await db.query(sql, [...values, limit, offset]);

    res.status(200).json({
      success: true,
      message: "Data pasien berhasil diambil",
      pagination: {
        page,
        limit,
        totalData,
        totalPage,
      },
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

//GET DATA PASIEN UNTUK DROP DOWN MENU
router.get("/dropdown", async (req, res) => {
  try {
    const id_relasi = req.query.id_relasi || null;

    const values = [id_relasi];

    // =========================
    // DATA QUERY
    // =========================
    let sql = `
      SELECT
          p.id_pasien,
          p.nama,
          p.kode_pasien
      FROM pasien p
      WHERE p.status_delete = 0
        AND (
            NOT EXISTS (
                SELECT 1
                FROM user u
                WHERE u.id_relasi = p.id_pasien
            )
            OR p.id_pasien = ?
        )
      ORDER BY p.nama ASC;
    `;

    console.log(id_relasi);
    const [result] = await db.query(sql, [id_relasi]);

    res.status(200).json({
      success: true,
      message: "Data pasien berhasil diambil",
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
router.post("/", auth, allow("pasien.create"), async (req, res) => {
  try {
    const {
      nama,
      alamat,
      tanggal_lahir,
      tempat_lahir,
      jenis_kelamin,
      email,
      no_telp,
      id_user,
    } = req.body;

    // =========================
    // VALIDASI FIELD WAJIB
    // =========================
    if (!nama?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Nama pasien wajib diisi",
      });
    }

    if (!jenis_kelamin) {
      return res.status(400).json({
        success: false,
        message: "Jenis kelamin wajib diisi",
      });
    }

    if (!tanggal_lahir) {
      return res.status(400).json({
        success: false,
        message: "Tanggal lahir wajib diisi",
      });
    }

    if (!alamat) {
      return res.status(400).json({
        success: false,
        message: "Alamat wajib diisi",
      });
    }

    const namaBersih = nama.trim().replace(/\s+/g, " ");

    if (!/^[\p{L} ]+$/u.test(namaBersih)) {
      return res.status(401).json({
        success: false,
        message: "Nama pasien hanya boleh berisi huruf dan spasi",
      });
    }

    // =========================
    // DEFAULT VALUE
    // =========================
    const pasienData = {
      nama: namaBersih,
      alamat: alamat?.trim(),
      tanggal_lahir,
      tempat_lahir: tempat_lahir?.trim() || "-",
      jenis_kelamin,
      email: email?.trim() || "-",
      no_telp: no_telp?.trim() || "-",
    };

    // =========================
    // AMBIL PASIEN TERAKHIR
    // =========================
    const [lastPatient] = await db.query(`
      SELECT kode_pasien
      FROM pasien
      ORDER BY kode_pasien DESC
      LIMIT 1
    `);

    let nextNumber = 1;

    if (lastPatient.length > 0) {
      const lastId = lastPatient[0].kode_pasien;
      console.log("lastId", lastId);

      const lastNumber = parseInt(lastId.split("-")[2]);

      nextNumber = lastNumber + 1;
    }

    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");

    const kode_pasien =
      `P-${year}${month}-` + String(nextNumber).padStart(4, "0");

    // =========================
    // INSERT DATABASE
    // =========================
    await db.query(
      `
      INSERT INTO pasien (
        kode_pasien,
        nama,
        alamat,
        tanggal_lahir,
        tempat_lahir,
        jenis_kelamin,
        email,
        no_telp
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        kode_pasien,
        pasienData.nama,
        pasienData.alamat,
        pasienData.tanggal_lahir,
        pasienData.tempat_lahir,
        pasienData.jenis_kelamin,
        pasienData.email,
        pasienData.no_telp,
      ],
    );

    await createAuditLog({
      id_user: id_user,
      action: "CREATE PASIEN" + kode_pasien,
    });

    res.json({
      success: true,
      message: "Pasien berhasil ditambahkan",
      kode_pasien,
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
router.put("/:id_pasien", auth, allow("pasien.update"), async (req, res) => {
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

    const namaBersih = nama.trim().replace(/\s+/g, " ");

    if (!/^[\p{L} ]+$/u.test(namaBersih)) {
      return res.status(401).json({
        success: false,
        message: "Nama pasien hanya boleh berisi huruf dan spasi",
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
//SOFT DELETE PASIEN
router.delete("/:id_pasien", auth, allow("pasien.delete"), async (req, res) => {
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
      action: `DELETE_PASIEN_` + req.user.id_user,
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
});

//GET DETAIL PASIEN
router.get("/:id", auth, allow("pasien.detail.read"), async (req, res) => {
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
        alamat,
        DATE_FORMAT(tanggal_lahir, '%Y-%m-%d') AS tanggal_lahir,
        tempat_lahir,
        jenis_kelamin,
        email,
        no_telp,
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

    res.json({
      success: true,
      data: {
        pasien: pasien[0],
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//GET DATA DETAIL PENGUKURAN DI HALAMAN PASIEN DETAIL
router.get(
  "/sesi/:id_pengukuran/pengukuran",
  auth,
  allow("pasien.detail-pengukuran.read"),
  async (req, res) => {
    try {
      const { id_pengukuran } = req.params;

      const data = await buildMeasurementData(id_pengukuran);

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Measurement tidak ditemukan",
        });
      }

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

module.exports = router;
