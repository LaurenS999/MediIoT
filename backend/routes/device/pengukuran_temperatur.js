const express = require("express");
const router = express.Router();

const db = require("../../db");
const auth = require("../../middleware/auth");
const allow = require("../../middleware/permission");
// ======================================================
// CREATE PENGUKURAN TEMPERATUR
// ======================================================
router.post(
  "/",
  auth,
  allow("pengukuran-temperatur.create"),
  async (req, res) => {
    try {
      const { id_pengukuran, suhu, payload_asli, mac, id_gateway } = req.body;

      if (suhu === null) {
        return res.status(400).json({
          success: false,
          message: "Data Termometer ada yang kosong",
        });
      }

      const sesiId = Number(id_pengukuran);

      const [result] = await db.query(
        `
      INSERT INTO pengukuran_suhu
      (
        id_sesi,
        suhu,
        payload_asli,
        mac,
        id_gateway
      )
      VALUES
      (?, ?, ?, ?, ?)
      `,
        [id_pengukuran, suhu, JSON.stringify(payload_asli), mac, id_gateway],
      );

      res.json({
        success: true,
        message: "Pengukuran Termometer berhasil disimpan",
        insertId: result.insertId,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
);

// ======================================================
// GET DETAIL TEMPERATUR
// ======================================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT *
      FROM pengukuran_temperatur
      WHERE id = ?
      LIMIT 1
    `;

    const [result] = await db.query(sql, [id]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data termometer tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: result[0],
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
// GET TEMPERATUR BERDASARKAN ID_SESI
// ======================================================
router.get("/sesi/:id_sesi", async (req, res) => {
  try {
    const { id_sesi } = req.params;

    const sql = `
      SELECT *
      FROM pengukuran_temperatur
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
      message: "Pengukuran Termometer gagal disimpan",
    });
  }
});

module.exports = router;
