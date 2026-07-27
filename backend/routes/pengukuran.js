const express = require("express");
const router = express.Router();

const db = require("../db");
const auth = require("../middleware/auth");
const allow = require("../middleware/permission");
const createAuditLog = require("../utils/auditLogs");

// ======================================================
// GET ALL SESI PENGUKURAN
// ======================================================
router.get("/", auth, allow("pengukuran.read"), async (req, res) => {
  try {
    const sql = `
      SELECT *
      FROM sesi_pengukuran
      ORDER BY id DESC
    `;

    const [result] = await db.query(sql);

    res.json(result);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Gagal mengambil data sesi pengukuran",
    });
  }
});

//GET RIWAYAT PENGUKURAN
router.get(
  "/riwayat",
  auth,
  allow("pengukuran.riwayat.read"),
  async (req, res) => {
    try {
      const keyword = req.query.search || "";

      // =========================
      // PAGINATION
      // =========================
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const params = [];

      // =========================
      // BASE QUERY (COUNT)
      // =========================
      let countSql = `
        SELECT COUNT(*) AS total
        FROM sesi_pengukuran sp
        LEFT JOIN pasien p ON sp.id_pasien = p.id_pasien
        LEFT JOIN user u ON sp.id_user = u.id_user
        WHERE 1=1
      `;

      // =========================
      // BASE QUERY (DATA)
      // =========================
      let sql = `
        SELECT
          sp.id,
          sp.kode_sesi,

          p.id_pasien,
          p.nama AS nama_pasien,
          p.jenis_kelamin,

          u.id_user,
          u.username AS nama_user,

          sp.dibuat_pada AS tanggal_pengukuran
        FROM sesi_pengukuran sp
        LEFT JOIN pasien p ON sp.id_pasien = p.id_pasien
        LEFT JOIN user u ON sp.id_user = u.id_user
        WHERE 1=1
      `;

      // =========================
      // SEARCH FILTER
      // =========================
      if (keyword.trim() !== "") {
        sql += `
          AND (
            p.nama LIKE ?
            OR sp.kode_sesi LIKE ?
            OR u.username LiKE ?
          )
        `;

        countSql += `
          AND (
            p.nama LIKE ?
            OR sp.kode_sesi LIKE ?
            OR u.username LiKE ?
          )
        `;

        params.push(`%${keyword}%`);
        params.push(`%${keyword}%`);
        params.push(`%${keyword}%`);
      }

      // =========================
      // COUNT QUERY
      // =========================
      const [countRows] = await db.query(countSql, params);

      const totalData = countRows[0].total;
      const totalPage = Math.ceil(totalData / limit);

      // =========================
      // FINAL DATA QUERY
      // =========================
      sql += `
        ORDER BY sp.id DESC
        LIMIT ? OFFSET ?
      `;

      const [rows] = await db.query(sql, [...params, limit, offset]);

      res.status(200).json({
        success: true,
        message: "Data riwayat berhasil diambil",
        pagination: {
          page,
          limit,
          totalData,
          totalPage,
        },
        data: rows,
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

// ======================================================
// GET SESI PENGUKURAN BY ID
// ======================================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT *
      FROM sesi_pengukuran
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Sesi pengukuran tidak ditemukan",
      });
    }

    res.json(result[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Terjadi kesalahan server",
    });
  }
});

// ======================================================
// CREATE SESI PENGUKURAN
// ======================================================
router.post("/", auth, allow("pengukuran.create"), async (req, res) => {
  try {
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
      FROM sesi_pengukuran
      WHERE DATE(dibuat_pada) = CURDATE()
    `;

    const [countResult] = await db.query(sqlCount);

    const urutan = countResult[0].total + 1;

    // 0001
    const nomorUrut = String(urutan).padStart(4, "0");

    // SESI-20260506-0001
    const kode_pengukuran = `PG-${tanggal}-${nomorUrut}`;

    // ==================================================
    // INSERT DATA
    // ==================================================
    const sqlInsert = `
      INSERT INTO sesi_pengukuran
      (
        kode_pengukuran
      )
      VALUES (?)
    `;

    const [insertResult] = await db.query(sqlInsert, [kode_pengukuran]);

    await createAuditLog({
      id_user: req.user.id_user,
      action: `CREATE PENGUKURAN ` + req.user.id_user,
    });

    res.status(201).json({
      success: true,
      message: "Sesi pengukuran berhasil dibuat",
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
// UPDATE SESI PENGUKURAN
// ======================================================
router.put("/:id", auth, allow("pengukuran.update"), async (req, res) => {
  try {
    const { id } = req.params;

    const { kode_sesi, id_pasien, id_perawat } = req.body;

    const sql = `
      UPDATE sesi_pengukuran
      SET
        kode_sesi = ?,
        id_pasien = ?,
        id_perawat = ?
      WHERE id = ?
    `;

    await db.query(sql, [kode_sesi, id_pasien, id_perawat, id]);

    res.json({
      success: true,
      message: "Sesi pengukuran berhasil diupdate",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Gagal update sesi pengukuran",
    });
  }
});

// ======================================================
// DELETE SESI PENGUKURAN
// ======================================================
router.delete("/:id", auth, allow("pengukuran.delete"), async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      DELETE FROM sesi_pengukuran
      WHERE id = ?
    `;

    await db.query(sql, [id]);

    res.json({
      success: true,
      message: "Sesi pengukuran berhasil dihapus",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Gagal menghapus sesi pengukuran",
    });
  }
});

module.exports = router;
