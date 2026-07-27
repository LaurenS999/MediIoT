const express = require("express");
const router = express.Router();

const db = require("../../db");
const auth = require("../../middleware/auth");
const allow = require("../../middleware/permission");
// ======================================================
// CREATE PENGUKURAN TENSI
// ======================================================
router.post("/", auth, allow("pengukuran.create"), async (req, res) => {
  try {
    const {
      id_pengukuran,

      systolic,
      diastolic,
      map,
      denyut_nadi,
      spo2,

      tipe_pasien,
      error_status,

      payload_asli,
      mac,
      id_gateway,
    } = req.body;

    if (
      systolic === null ||
      diastolic === null ||
      map === null ||
      denyut_nadi === null ||
      spo2 === null
    ) {
      return res.status(400).json({
        success: false,
        message: "Data Tensi ada yang kosong",
      });
    }

    const sesiId = Number(id_pengukuran);

    const [result] = await db.query(
      `
      INSERT INTO pengukuran_tensi
      (
        id_sesi,

        systolic,
        diastolic,
        map,
        denyut_nadi,
        spo2,

        tipe_pasien,
        error_status,

        payload_asli,
        mac,
        id_gateway
      )
      VALUES
      (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
      `,
      [
        id_pengukuran,

        systolic,
        diastolic,
        map,
        denyut_nadi,
        spo2,

        tipe_pasien,
        error_status,

        JSON.stringify(payload_asli),

        mac,
        id_gateway,
      ],
    );

    res.json({
      success: true,
      message: "Pengukuran tensi berhasil disimpan",
      insertId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Pengukuran Tensi gagal disimpan",
    });
  }
});

module.exports = router;
