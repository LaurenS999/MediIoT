const express = require("express");
const router = express.Router();

const db = require("../../db");
const auth = require("../../middleware/auth");
const allow = require("../../middleware/permission");
// ======================================================
// CREATE PENGUKURAN OXYMETER
// ======================================================
router.post("/", auth, allow("pengukuran.create"), async (req, res) => {
  try {
    const { id_pengukuran, spo2, denyut_nadi, payload_asli, mac, id_gateway } =
      req.body;

    if (spo2 === null || denyut_nadi === null) {
      return res.status(400).json({
        success: false,
        message: "Data Oxymeter ada yang kosong",
      });
    }

    const sesiId = Number(id_pengukuran);

    const [result] = await db.query(
      `
      INSERT INTO pengukuran_oxy
      (
        id_sesi,
        spo2,
        denyut_nadi,
        payload_asli,
        mac,
        id_gateway
      )
      VALUES
      (?, ?,? , ?, ?, ?)
      `,
      [
        id_pengukuran,
        spo2,
        denyut_nadi,
        JSON.stringify(payload_asli),
        mac,
        id_gateway,
      ],
    );

    res.json({
      success: true,
      message: "Pengukuran oxy berhasil disimpan",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================================================
// GET OXYMETER BERDASARKAN ID_SESI
// ======================================================
router.get("/sesi/:id_sesi", async (req, res) => {
  try {
    const { id_pengukuran } = req.params;

    const sql = `
      SELECT *
      FROM pengukuran_oxy
      WHERE id_sesi = ?
      ORDER BY created_at DESC
    `;

    const [result] = await db.query(sql, [id_pengukuran]);

    res.json({
      success: true,
      total: result.length,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Pengukuran Oxymeter gagal disimpan",
    });
  }
});

module.exports = router;
