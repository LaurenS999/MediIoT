const express = require("express");
const router = express.Router();

const db = require("../db");
const allow = require("../middleware/permission");
const auth = require("../middleware/auth");
const createAuditLog = require("../utils/auditLogs");

// ======================================================
// GET ACCESS TOKEN
// ======================================================
router.get("/", auth, async (req, res) => {
  try {
    const sql = `
      SELECT *
      FROM access_token
      LIMIT 1
    `;

    const [rows] = await db.query(sql);

    // kalau belum ada data
    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("GET ACCESS TOKEN ERROR :", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

// ======================================================
// CREATE / UPDATE ACCESS TOKEN
// ======================================================
router.post("/", auth, allow("api.manage"), async (req, res) => {
  console.log("TEST");
  try {
    const { client_id, client_key, server_key, id_user } = req.body;
    console.log("CLIENT ID : ", client_id);
    console.log("CLIENT KEY : ", client_key);
    console.log("CLIENT KEY : ", client_key);
    // validasi
    if (!client_id || !client_key || !server_key) {
      return res.status(400).json({
        success: false,
        message: "client id, client key, dan Server key wajib diisi",
      });
    }

    // cek apakah data sudah ada
    const checkSql = `
      SELECT id
      FROM access_token
      LIMIT 1
    `;

    const [existing] = await db.query(checkSql);

    // ======================================================
    // UPDATE
    // ======================================================
    if (existing.length > 0) {
      const updateSql = `
        UPDATE access_token
        SET
          client_id = ?,
          client_key = ?,
          server_key = ?,
          diperbarui_pada = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const [result] = await db.query(updateSql, [
        client_id,
        client_key,
        server_key,
        existing[0].id,
      ]);

      await createAuditLog({
        id_user: id_user,
        action: "UPDATE ACCESS KEY",
      });

      console.log("UPDATE RESULT :", result);
      return res.status(200).json({
        success: true,
        message: "Access token berhasil diperbarui",
      });
    }

    // ======================================================
    // INSERT
    // ======================================================
    const insertSql = `
      INSERT INTO access_token (
        client_id,
        client_key
        server_key
      )
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(insertSql, [
      client_id,
      client_key,
      server_key,
    ]);

    await createAuditLog({
      id_user: id_user,
      action: "CREATE ACCESS KEY",
    });

    console.log("INSERT RESULT :", result);
    res.status(201).json({
      success: true,
      message: "Access token berhasil dibuat",
    });
  } catch (error) {
    console.error("SAVE ACCESS TOKEN ERROR :", error);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

module.exports = router;
