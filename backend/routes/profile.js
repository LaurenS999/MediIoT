const express = require("express");
const router = express.Router();

const db = require("../db");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth.js");

const createAuditLog = require("../utils/auditLogs");
const bcrypt = require("bcrypt");

router.put("/", auth, async (req, res) => {
  try {
    const { username, password_lama, password_baru } = req.body;

    const [rows] = await db.query(
      `
      SELECT *
      FROM user
      WHERE id_user = ?
      LIMIT 1
      `,
      [req.user.id_user],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const user = rows[0];

    // Jika tidak ganti username dan password
    console.log("USER : ", user);
    console.log("USERNAME BARU : ", username);
    const isUsernameChanged = username?.trim() !== user.username?.trim();

    const isPasswordChanged = Boolean(password_lama) || Boolean(password_baru);

    if (!username || username == "") {
      return res.status(401).json({
        success: false,
        message: "Username tidak boleh kosong",
      });
    }

    if (!isUsernameChanged && !isPasswordChanged) {
      return res.status(200).json({
        success: false,
        message: "Tidak ada data yang berubah",
      });
    }

    // Jika ingin ganti password
    if (password_lama || password_baru) {
      if (!password_lama || !password_baru) {
        return res.status(400).json({
          success: false,
          message: "Password lama dan password baru wajib diisi",
        });
      }

      if (user.password !== password_lama) {
        return res.status(400).json({
          success: false,
          message: "Password lama tidak sesuai",
        });
      }

      if (password_lama === password_baru) {
        return res.status(400).json({
          success: false,
          message: "Password baru harus berbeda",
        });
      }
    }

    await db.query(
      `
      UPDATE user
      SET
        username = ?,
        password = COALESCE(?, password),
        diperbarui_pada = CURRENT_TIMESTAMP
      WHERE id_user = ?
      `,
      [username ?? user.username, password_baru || null, req.user.id_user],
    );

    res.status(200).json({
      success: true,
      message: "Profil berhasil diperbarui",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// PATCH /user/profile
router.patch("/user", auth, async (req, res) => {
  const { username } = req.body;
  const id_user = req.user.id_user;

  try {
    if (!username || username.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Username wajib diisi",
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

    const usernameClean = username.trim();

    // Cek apakah username sudah digunakan user lain
    const [existingUser] = await db.query(
      `
      SELECT id_user
      FROM user
      WHERE username = ?
      AND id_user != ?
      LIMIT 1
      `,
      [usernameClean, id_user],
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Username sudah digunakan",
      });
    }

    await db.query(
      `
      UPDATE user
      SET username = ?
      WHERE id_user = ?
      `,
      [usernameClean, id_user],
    );

    return res.status(200).json({
      success: true,
      message: "Profile berhasil diperbarui",
    });
  } catch (error) {
    console.error("ERROR UPDATE PROFILE :", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

// PATCH profile/password
router.patch("/password", auth, async (req, res) => {
  const { password_lama, password_baru } = req.body;
  const id_user = req.user.id_user;

  try {
    if (!password_lama || !password_baru) {
      return res.status(400).json({
        success: false,
        message: "Password lama dan password baru wajib diisi",
      });
    }

    // Minimal 8 karakter
    if (password_baru.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password baru minimal 8 karakter",
      });
    }

    // Minimal 1 huruf besar
    // if (!/[A-Z]/.test(password_baru)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Password harus memiliki minimal 1 huruf besar",
    //   });
    // }

    // // Minimal 1 huruf kecil
    // if (!/[a-z]/.test(password_baru)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Password harus memiliki minimal 1 huruf kecil",
    //   });
    // }

    // // Minimal 1 angka
    // if (!/[0-9]/.test(password_baru)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Password harus memiliki minimal 1 angka",
    //   });
    // }

    // // Minimal 1 simbol
    // if (!/[^A-Za-z0-9]/.test(password_baru)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Password harus memiliki minimal 1 simbol",
    //   });
    // }

    // Ambil password user saat ini
    const [rows] = await db.query(
      `
      SELECT password
      FROM user
      WHERE id_user = ?
      LIMIT 1
      `,
      [id_user],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const user = rows[0];

    // Bandingkan password lama
    const passwordValid = await bcrypt.compare(password_lama, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Password lama tidak sesuai",
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(password_baru, 10);

    // Update password
    await db.query(
      `
      UPDATE user
      SET password = ?
      WHERE id_user = ?
      `,
      [hashedPassword, id_user],
    );

    return res.status(200).json({
      success: true,
      message: "Password berhasil diubah",
    });
  } catch (error) {
    console.error("ERROR UPDATE PASSWORD :", error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
});

module.exports = router;
