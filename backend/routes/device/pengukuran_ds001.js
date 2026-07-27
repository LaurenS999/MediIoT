const express = require("express");
const router = express.Router();

const db = require("../db");
const auth = require("../middleware/auth");
const allow = require("../middleware/permission");
const createAuditLog = require("../utils/auditLogs");

// ======================================================
// CREATE PENGUKURAN DS001
// ======================================================
router.post("/", auth, allow("pengukuran.create"), async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id_sesi, data } = req.body;

    if (!id_sesi) {
      return res.status(400).json({
        message: "ID sesi wajib diisi",
      });
    }

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        message: "Data pengukuran tidak valid",
      });
    }

    await connection.beginTransaction();

    const values = data.map((item) => [
      item.systolic,
      item.diastolic,
      item.mean,
      item.denyut_nadi,
      item.suhu,
      item.spo2,
      item.pr_spo2,
      item.rr,
      item.tcp_ip,
      item.id_gateway,
      id_sesi,
    ]);

    await connection.query(
      `
      INSERT INTO pengukuran_ds001 (
        systolic,
        diastolic,
        mean,
        denyut_nadi,
        suhu,
        spo2,
        pr_spo2,
        rr,
        tcp_ip,
        id_gateway,
        id_sesi
      )
      VALUES ?
      `,
      [values],
    );

    await createAuditLog(
      req.user.id,
      "CREATE",
      "pengukuran_ds001",
      null,
      {
        id_sesi,
        total_data: data.length,
      },
      connection,
    );

    await connection.commit();

    res.status(201).json({
      message: "Data pengukuran berhasil disimpan",
      total_data: data.length,
    });
  } catch (error) {
    await connection.rollback();

    console.log(error);

    res.status(500).json({
      message: "Gagal menyimpan data pengukuran",
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
