const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const allow = require("../middleware/permission");

// ======================================================
// TREND BERAT BADAN
// ======================================================
router.get(
  "/:id/:interval/berat-badan",
  auth,
  allow("trend.berat.read"),
  async (req, res) => {
    try {
      const { id, interval } = req.params;

      console.log("=== [DEBUG] Request masuk ===");
      console.log("ID Pasien:", id);

      const sql = `
      SELECT b.berat, b.dibuat_pada
        FROM pengukuran_bmi b 
        inner join sesi_pengukuran s ON b.id_sesi = s.id_pengukuran
        inner join kunjungan k ON k.id_pengukuran = s.id_pengukuran
        WHERE k.id_pasien = ? AND k.dibuat_pada >= NOW() - INTERVAL ? DAY
        ORDER BY b.dibuat_pada ASC;
    `;

      // Menggunakan await (gaya Promise)
      const [result] = await db.query(sql, [id, interval]);

      if (result.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "Pasien belum memiliki data berat badan",
        });
      }

      console.log("=== [DEBUG] Query Berhasil ===");
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      console.error("=== [DEBUG] Query Error ===");
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil trend berat badan",
      });
    }
  },
);

// ======================================================
// TREND TEKANAN DARAH
// ======================================================
router.get(
  "/:id/:interval/tekanan-darah",
  auth,
  allow("trend.tekanan-darah.read"),
  async (req, res) => {
    try {
      const { id, interval } = req.params;

      const sql = `
      SELECT t.systolic, t.diastolic, t.dibuat_pada
        FROM pengukuran_tensi t 
        inner join sesi_pengukuran s ON t.id_sesi = s.id_pengukuran
        inner join kunjungan k ON k.id_pengukuran = s.id_pengukuran
        WHERE k.id_pasien = ? AND k.dibuat_pada >= NOW() - INTERVAL ? DAY
        ORDER BY t.dibuat_pada ASC;
    `;

      const [result] = await db.query(sql, [id, interval]);

      if (result.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "Pasien belum memiliki data tekanan darah",
        });
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil trend tekanan darah",
      });
    }
  },
);

// ======================================================
// TREND BODY FAT
// ======================================================
router.get(
  "/:id/:interval/body-fat",
  auth,
  allow("trend.fat.read"),
  async (req, res) => {
    try {
      const { id, interval } = req.params;

      const sql = `
      SELECT b.body_fat, b.dibuat_pada
        FROM pengukuran_bmi b 
        inner join sesi_pengukuran s ON b.id_sesi = s.id_pengukuran
        inner join kunjungan k ON k.id_pengukuran = s.id_pengukuran
        WHERE k.id_pasien = ? AND k.dibuat_pada >= NOW() - INTERVAL ? DAY
        ORDER BY b.dibuat_pada ASC;
    `;

      const [result] = await db.query(sql, [id, interval]);

      if (result.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "Pasien belum memiliki data body fat",
        });
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil trend body fat",
      });
    }
  },
);

// ======================================================
// TREND MUSCLE MASS
// ======================================================
router.get(
  "/:id/:interval/muscle-mass",
  auth,
  allow("trend.muscle.read"),
  async (req, res) => {
    try {
      const { id, interval } = req.params;

      const sql = `
      SELECT b.muscle_mass, b.dibuat_pada
        FROM pengukuran_bmi b 
        inner join sesi_pengukuran s ON b.id_sesi = s.id_pengukuran
        inner join kunjungan k ON k.id_pengukuran = s.id_pengukuran
        WHERE k.id_pasien = ? AND k.dibuat_pada >= NOW() - INTERVAL ? DAY
        ORDER BY b.dibuat_pada ASC;
    `;

      const [result] = await db.query(sql, [id, interval]);

      if (result.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "Pasien belum memiliki data muscle mass",
        });
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil trend muscle mass",
      });
    }
  },
);

module.exports = router;
