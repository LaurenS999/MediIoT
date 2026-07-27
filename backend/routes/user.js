const express = require("express");
const router = express.Router();

const db = require("../db");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth.js");

const createAuditLog = require("../utils/auditLogs");
const bcrypt = require("bcrypt");
// =====================================================
// GET ALL USER
// =====================================================
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

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
      FROM user u inner join peran p on u.id_peran = p.id_peran
      WHERE status_delete = 0
    `;

    // =========================
    // DATA QUERY
    // =========================
    let sql = `
      SELECT
        u.id_user,
        u.username,
        p.nama as nama_role,
        u.id_peran as role,
        u.status_aktif,
        u.dibuat_pada,
        u.diperbarui_pada,
        u.id_relasi
      FROM user u inner join peran p ON u.id_peran = p.id_peran
            WHERE u.status_delete = 0 AND p.id_peran != 4
    `;

    // =========================
    // SEARCH FILTER
    // =========================
    if (search.trim() !== "") {
      countSql += `
        AND (
          u.username LIKE ?
          OR u.id_user LIKE ?
          OR p.nama LIKE ?
        )
      `;

      sql += `
        AND (
          u.username LIKE ?
          OR u.id_user LIKE ?
          OR p.nama LIKE ?
        )
      `;

      values.push(`%${search}%`);
      values.push(`%${search}%`);
      values.push(`%${search}%`);
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
      ORDER BY dibuat_pada DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.query(sql, [...values, limit, offset]);

    res.status(200).json({
      success: true,
      message: "Data user berhasil diambil",
      pagination: {
        page,
        limit,
        totalData,
        totalPage,
      },
      data: rows,
      // data: [],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// =====================================================
// GET USER BY ID
// =====================================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
        SELECT
          u.id_user,
          u.username,
          u.id_peran as role,
          u.status_aktif,
          u.dibuat_pada,
          u.diperbarui_pada,
          u.id_relasi
        FROM user u inner join peran p ON u.id_peran = p.id_peran
        WHERE id_user = ? 
        AND status_delete = 0
        LIMIT 1
      `;

    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// =====================================================
// CREATE USER
// =====================================================
router.post("/", auth, async (req, res) => {
  try {
    const { username, role, password, id_relasi } = req.body;
    console.log("REQUSET BODY : , ", req.body);
    // VALIDASI
    if (!username || !role || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
    }

    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message:
          "Username hanya boleh berisi huruf, angka, underscore (_), dan dot (.).",
      });
    }

    if (username.length < 8) {
      return res.status(400).json({
        message: "Username minimal 8 karakter",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password minimal 8 karakter",
      });
    }

    const [rows] = await db.query(
      "SELECT id_user FROM user WHERE username = ?",
      [username],
    );

    if (rows.length > 0) {
      return res.status(409).json({
        message: "Username sudah digunakan",
      });
    }

    if (role === "super admin") {
      return res.status(403).json({
        success: false,
        message: "tidak dapat membuat role Super Admin",
      });
    }

    const ROLE_PASIEN = 5;

    let tipeRelasi = null;
    let idRelasi = null;

    if (Number(role) === ROLE_PASIEN) {
      tipeRelasi = "pasien";
      idRelasi = id_relasi;

      if (!id_relasi) {
        return res.status(400).json({
          success: false,
          message: "ID Pasien wajib dipilih",
        });
      }
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO user (
        username,
        id_peran,
        password,
        tipe_relasi,
        id_relasi
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      username,
      role,
      hashedPassword,
      tipeRelasi,
      idRelasi,
    ]);

    res.status(201).json({
      success: true,
      message: "User berhasil ditambahkan",
      data: {
        id_user: result.insertId,
        username,
        role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// =====================================================
// UPDATE USER
// =====================================================
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const { username, role, password, status_aktif, id_relasi } = req.body;
    console.log("REQUEST BODY : ", req.body);

    if (!username || username == "" || !role || role == "") {
      return res.status(400).json({
        success: false,
        message: "Username dan role tidak boleh kosong",
      });
    }

    // CHECK USER
    const [checkRows] = await db.query(
      `
      SELECT *
      FROM user
      WHERE id_user = ?
      LIMIT 1
      `,
      [id],
    );

    const targetUser = checkRows[0];

    if (checkRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    console.log("TARGET USER : ", targetUser);

    const isUsernameChanged = username?.trim() !== targetUser.username?.trim();
    const isRoleChanged = role !== targetUser.role;
    const isStatusChanged = status_aktif !== targetUser.status_aktif;

    if (!isUsernameChanged && !isRoleChanged && !isStatusChanged) {
      return res.status(200).json({
        success: false,
        message: "Tidak ada data yang berubah",
      });
    }

    // admin tidak boleh mengubah super admin
    if (targetUser.role === "super admin") {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk mengubah Super Admin",
      });
    }

    if (role === "super admin") {
      return res.status(403).json({
        success: false,
        message: "Admin tidak dapat memberikan role Super Admin",
      });
    }

    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message:
          "Username hanya boleh berisi huruf, angka, underscore (_), dan dot (.).",
      });
    }

    if (username.length < 8) {
      return res.status(400).json({
        message: "Username minimal 8 karakter",
      });
    }

    let idRelasi = null;
    let tipe_relasi = null;

    if (id_relasi != null) {
      idRelasi = id_relasi;
      tipe_relasi = "pasien";
    }

    let sql = `
      UPDATE user
      SET
        username = ?,
        id_peran = ?,
        status_aktif = ?,
        tipe_relasi = ?,
        id_relasi = ?
    `;

    const values = [username, role, status_aktif, tipe_relasi, idRelasi];

    if (password && password.trim() !== "") {
      if (password.length < 8) {
        return res.status(400).json({
          message: "Password minimal 8 karakter",
        });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      sql += `, password = ?`;
      values.push(hashedPassword);
    }

    sql += ` WHERE id_user = ?`;
    values.push(id);

    await db.query(sql, values);

    res.status(200).json({
      success: true,
      message: "User berhasil diupdate",
    });
  } catch (error) {
    console.log(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Username sudah digunakan oleh user lain",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// =====================================================
// DELETE USER (SOFT DELETE)
// =====================================================
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // CHECK USER
    const [checkRows] = await db.query(
      `
  SELECT *
  FROM user
  WHERE id_user = ?
  AND status_delete = 0
  LIMIT 1
  `,
      [id],
    );

    if (checkRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const targetUser = checkRows[0];

    // ADMIN TIDAK BOLEH HAPUS SUPER ADMIN
    if (req.user.role === "admin" && targetUser.role === "super admin") {
      return res.status(403).json({
        success: false,
        message: "Admin tidak dapat menghapus Super Admin",
      });
    }

    // SOFT DELETE
    await db.query(
      `
  UPDATE user
  SET
    status_delete = 1,
    diperbarui_pada = CURRENT_TIMESTAMP
  WHERE id_user = ?
  `,
      [id],
    );

    res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // VALIDASI
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama dan password wajib diisi",
      });
    }

    const sql = `
      SELECT
        id_user,
        username,
        password,
        p.nama as role,
        status_aktif,
        bertugas_di,
        id_relasi
      FROM user u
      INNER JOIN peran p ON u.id_peran = p.id_peran
      WHERE username = ?
        AND status_delete = 0
      LIMIT 1
    `;

    const [rows] = await db.query(sql, [username]);

    // LOGIN GAGAL
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    const user = rows[0];

    // USER NONAKTIF
    if (user.status_aktif === 1) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak bisa Login karena user sedang tidak aktif",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Username atau password salah",
      });
    }

    // =========================================
    // GET ACCESS TOKEN
    // =========================================
    const tokenSql = `
      SELECT *
      FROM access_token
      LIMIT 1
    `;

    const [tokenRows] = await db.query(tokenSql);

    const accessTokenData = tokenRows.length > 0 ? tokenRows[0] : null;

    // =========================================
    // GENERATE TOKEN
    // =========================================
    const token = jwt.sign(
      {
        id_user: user.id_user,
        username: user.username,
        role: user.role,
        id_relasi: user.id_relasi,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    console.log("TOKEN : ", token);

    await createAuditLog({
      id_user: user.id_user,
      action: "LOGIN",
    });

    // LOGIN BERHASIL
    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: {
        token,
        user,
        access: accessTokenData,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
