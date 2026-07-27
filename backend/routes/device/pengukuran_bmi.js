const express = require("express");
const router = express.Router();

const db = require("../../db");
const auth = require("../../middleware/auth");
const allow = require("../../middleware/permission");

router.post("/", auth, allow("pengukuran.create"), async (req, res) => {
  try {
    const {
      id_pengukuran,

      berat,
      tinggi_badan,

      bmi,
      bmi_label,

      body_fat,
      body_fat_label,

      muscle_mass,
      muscle_mass_label,

      water,
      water_label,

      visceral_fat,
      visceral_fat_label,

      bone,
      bone_label,

      metabolism,
      metabolism_label,

      protein,
      protein_label,

      body_age,
      lbm,

      payload_asli,
      mac,
      id_gateway,
    } = req.body;

    if (berat === null || tinggi_badan === null) {
      return res.status(400).json({
        success: false,
        message: "Data Timbangan BMI ada yang kosong",
      });
    }

    // =====================================================
    // PAKSA JADI NUMBER
    // =====================================================
    const sesiId = Number(id_pengukuran);

    // =====================================================
    // INSERT ATAU UPDATE BMI
    // =====================================================
    const [result] = await db.query(
      `
      INSERT INTO pengukuran_bmi
      (

        id_sesi,

        berat,
        tinggi_badan,

        bmi,
        bmi_label,

        body_fat,
        body_fat_label,

        muscle_mass,
        muscle_mass_label,

        water,
        water_label,

        visceral_fat,
        visceral_fat_label,

        bone,
        bone_label,

        metabolism,
        metabolism_label,

        protein,
        protein_label,

        body_age,
        lbm,

        payload_asli,
        mac,
        id_gateway

      )
      VALUES
      (

        ?, ?, ?,
        ?, ?,
        ?, ?,
        ?, ?,
        ?, ?,
        ?, ?,
        ?, ?,
        ?, ?,
        ?, ?,
        ?, ?,
        ?, ?, ?

      )
      `,
      [
        id_pengukuran,

        berat,
        tinggi_badan,

        bmi,
        bmi_label,

        body_fat,
        body_fat_label,

        muscle_mass,
        muscle_mass_label,

        water,
        water_label,

        visceral_fat,
        visceral_fat_label,

        bone,
        bone_label,

        metabolism,
        metabolism_label,

        protein,
        protein_label,

        body_age,
        lbm,

        JSON.stringify(payload_asli),

        mac,
        id_gateway,
      ],
    );

    // =====================================================
    // RESPONSE
    // =====================================================
    res.json({
      success: true,
      message: "BMI berhasil disimpan / diperbarui",
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
// GET BMI BERDASARKAN ID_SESI
// ======================================================
router.get("/sesi/:id_sesi", async (req, res) => {
  try {
    const { id_sesi } = req.params;

    const sql = `
      SELECT *
      FROM pengukuran_bmi
      WHERE id_sesi = ?
      ORDER BY created_at DESC
    `;

    const [result] = await db.query(sql, [id_sesi]);

    res.json({
      success: true,
      total: result.length,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
