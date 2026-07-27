const express = require("express");

const router = express.Router();

const db = require("../db");
const auth = require("../middleware/auth.js");
const allow = require("../middleware/permission");
/* ======================================================
   GET AUDIT LOGS
====================================================== */
router.get("/", auth, allow("auditLog.read"), async (req, res) => {
  try {
    const sql = `
      SELECT
        audit_logs.id,
        audit_logs.action,
        audit_logs.dibuat_pada,

        user.id_user,
        user.username,
        user.role

      FROM audit_logs

      LEFT JOIN user
      ON audit_logs.id_user = user.id_user

      ORDER BY audit_logs.dibuat_pada DESC
    `;

    const [rows] = await db.query(sql);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
});

module.exports = router;
