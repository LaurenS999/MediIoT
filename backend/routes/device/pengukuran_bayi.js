const express = require("express");
const router = express.Router();

const db = require("../../db");
const auth = require("../../middleware/auth");
const allow = require("../../middleware/permission");

// ======================================================
// CREATE PENGUKURAN BERAT BAYI
// ======================================================
router.post("/", auth, allow("pengukuran.create"), async (req, res) => {
  try {
    const {
      id_pengukuran,
      berat,

      payload_asli,
      mac,
      id_gateway,
    } = req.body;
    console.log("REQUEST BODY BAYI : ", req.body);

    if (berat === null) {
      return res.status(400).json({
        success: false,
        message: "Data Timbangan Bayi ada yang kosong",
      });
    }

    console.log("BERAT : ", berat);
    const sesiId = Number(id_pengukuran);

    const [result] = await db.query(
      `
      INSERT INTO pengukuran_berat_bayi
      (
        id_sesi,
        berat,
        payload_asli,
        mac,
        id_gateway
      )
      VALUES
      (?, ?, ?, ?, ?)
      `,
      [id_pengukuran, berat, JSON.stringify(payload_asli), mac, id_gateway],
    );

    res.json({
      success: true,
      message: "Pengukuran Timbangan Bayi berhasil disimpan",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Pengukuran Timbangan Bayi gagal disimpan",
    });
  }
});

module.exports = router;
