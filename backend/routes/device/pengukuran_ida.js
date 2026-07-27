const express = require("express");
const router = express.Router();

const db = require("../../db");
const auth = require("../../middleware/auth");
const allow = require("../../middleware/permission");
// ======================================================
// CREATE PENGUKURAN IDA
// ======================================================
router.post("/", auth, allow("pengukuran.create"), async (req, res) => {
  try {
    const {
      id_pengukuran,
      berat_ibu,
      berat_bayi,

      payload_asli,
      mac,
      id_gateway,
    } = req.body;

    if (berat_ibu === null || berat_bayi === null) {
      return res.status(400).json({
        success: false,
        message: "Data Timbangan Ibu dan Anak ada ang kosong",
      });
    }

    const sesiId = Number(id_pengukuran);

    const [result] = await db.query(
      `
      INSERT INTO pengukuran_ida
      (
        id_sesi,
        berat_ibu,
        berat_bayi,
        payload_asli,
        mac,
        id_gateway
      )
      VALUES
      (?, ?, ?, ?, ?, ?)
      `,
      [
        id_pengukuran,
        berat_ibu,
        berat_bayi,

        JSON.stringify(payload_asli),

        mac,
        id_gateway,
      ],
    );

    res.json({
      success: true,
      message: "Pengukuran IDA berhasil disimpan",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Pengukuran Timbangan Ibu dan Anak gagal disimpan",
    });
  }
});
module.exports = router;
