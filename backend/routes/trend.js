const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const allow = require("../middleware/permission");

// ======================================================
// TREND BERAT BADAN
// ======================================================
router.get(
  "/:id_pasien/:id_kunjungan/berat-badan",
  auth,
  allow("trend.berat.read"),
  async (req, res) => {
    try {
      const { id_pasien, id_kunjungan } = req.params;

      const sql = `
      SELECT
            berat,
            dibuat_pada
        FROM (
            SELECT *
            FROM (
                SELECT
                    b.berat,
                    b.dibuat_pada,
                    ROW_NUMBER() OVER (
                        PARTITION BY DATE(b.dibuat_pada)
                        ORDER BY b.dibuat_pada DESC
                    ) AS rn
                FROM pengukuran_bmi b
                INNER JOIN sesi_pengukuran s
                    ON b.id_sesi = s.id_pengukuran
                INNER JOIN kunjungan k
                    ON k.id_pengukuran = s.id_pengukuran
                WHERE k.id_pasien = ?
                  AND DATE(k.dibuat_pada) <= (
                      SELECT DATE(dibuat_pada)
                      FROM kunjungan
                      WHERE id_kunjungan = ?
                  )
            ) ranked
            WHERE rn = 1
            ORDER BY dibuat_pada DESC
            LIMIT 7
        ) last_seven
        ORDER BY dibuat_pada ASC;
    `;

      // Menggunakan await (gaya Promise)
      const [result] = await db.query(sql, [id_pasien, id_kunjungan]);

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
  "/:id_pasien/:id_kunjungan/tekanan-darah",
  auth,
  allow("trend.tekanan-darah.read"),
  async (req, res) => {
    try {
      const { id_pasien, id_kunjungan } = req.params;

      const sql = `
        SELECT
            systolic,
            diastolic,
            dibuat_pada
        FROM (
            SELECT *
            FROM (
                SELECT
                    t.systolic,
                    t.diastolic,
                    t.dibuat_pada,
                    ROW_NUMBER() OVER (
                        PARTITION BY DATE(t.dibuat_pada)
                        ORDER BY t.dibuat_pada DESC
                    ) AS rn
                FROM pengukuran_tensi t
                INNER JOIN sesi_pengukuran s
                    ON t.id_sesi = s.id_pengukuran
                INNER JOIN kunjungan k
                    ON k.id_pengukuran = s.id_pengukuran
                WHERE k.id_pasien = ?
                  AND k.dibuat_pada <= (
                      SELECT dibuat_pada
                      FROM kunjungan
                      WHERE id_kunjungan = ?
                  )
            ) AS ranked
            WHERE rn = 1
            ORDER BY dibuat_pada DESC
            LIMIT 7
        ) AS last_seven
        ORDER BY dibuat_pada ASC;`;

      const [result] = await db.query(sql, [id_pasien, id_kunjungan]);

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
  "/:id_pasien/:id_kunjungan/body-fat",
  auth,
  allow("trend.fat.read"),
  async (req, res) => {
    try {
      const { id_pasien, id_kunjungan } = req.params;

      const sql = `
        SELECT
            body_fat,
            dibuat_pada
        FROM (
            SELECT *
            FROM (
                SELECT
                    b.body_fat,
                    b.dibuat_pada,
                    ROW_NUMBER() OVER (
                        PARTITION BY DATE(b.dibuat_pada)
                        ORDER BY b.dibuat_pada DESC
                    ) AS rn
                FROM pengukuran_bmi b
                INNER JOIN sesi_pengukuran s
                    ON b.id_sesi = s.id_pengukuran
                INNER JOIN kunjungan k
                    ON k.id_pengukuran = s.id_pengukuran
                WHERE k.id_pasien = ?
                  AND k.dibuat_pada <= (
                      SELECT dibuat_pada
                      FROM kunjungan
                      WHERE id_kunjungan = ?
                  )
            ) AS ranked
            WHERE rn = 1
            ORDER BY dibuat_pada DESC
            LIMIT 7
        ) AS last_seven
        ORDER BY dibuat_pada ASC;
      `;

      const [result] = await db.query(sql, [id_pasien, id_kunjungan]);

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
  "/:id_pasien/:id_kunjungan/muscle-mass",
  auth,
  allow("trend.muscle.read"),
  async (req, res) => {
    try {
      const { id_pasien, id_kunjungan } = req.params;

      const sql = `
        SELECT
            muscle_mass,
            dibuat_pada
        FROM (
            SELECT *
            FROM (
                SELECT
                    b.muscle_mass,
                    b.dibuat_pada,
                    ROW_NUMBER() OVER (
                        PARTITION BY DATE(b.dibuat_pada)
                        ORDER BY b.dibuat_pada DESC
                    ) AS rn
                FROM pengukuran_bmi b
                INNER JOIN sesi_pengukuran s
                    ON b.id_sesi = s.id_pengukuran
                INNER JOIN kunjungan k
                    ON k.id_pengukuran = s.id_pengukuran
                WHERE k.id_pasien = ?
                  AND k.dibuat_pada <= (
                      SELECT dibuat_pada
                      FROM kunjungan
                      WHERE id_kunjungan = ?
                  )
            ) AS ranked
            WHERE rn = 1
            ORDER BY dibuat_pada DESC
            LIMIT 7
        ) AS last_seven
        ORDER BY dibuat_pada ASC;
      `;

      const [result] = await db.query(sql, [id_pasien, id_kunjungan]);

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
