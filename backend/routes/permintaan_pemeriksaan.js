const express = require("express");
const router = express.Router();

const { buildMeasurementData } = require("../helpers/pengukuranHelper.js");

const db = require("../db.js");
const auth = require("../middleware/auth.js");
const allow = require("../middleware/permission.js");
const createAuditLog = require("../utils/auditLogs.js");

router.get(
  "/",
  auth,
  allow("permintaan.pemeriksaan.read"),
  async (req, res) => {
    try {
      // =========================
      // PAGINATION
      // =========================
      console.log("REQUEST QUERY : ", req.query);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // =========================
      // COUNT QUERY
      // =========================
      const countSql = `
        SELECT COUNT(*) AS total
        FROM permintaan_pemeriksaan pe
        INNER JOIN pasien p
          ON pe.id_pasien = p.id_pasien
      `;

      // =========================
      // DATA QUERY
      // =========================
      const sql = `
        SELECT
          pe.id_permintaan_pemeriksaan,
          pe.tanggal_pemeriksaan,
          pe.keluhan,
          pe.status,
          
          TIME_FORMAT(pe.waktu_kunjungan_awal, '%H:%i') AS waktu_kunjungan_awal,
          TIME_FORMAT(pe.waktu_kunjungan_akhir, '%H:%i') AS waktu_kunjungan_akhir,

          p.id_pasien,
          p.nama AS nama_pasien
        FROM permintaan_pemeriksaan pe
        INNER JOIN pasien p
          ON pe.id_pasien = p.id_pasien
        ORDER BY pe.id_permintaan_pemeriksaan DESC
        LIMIT ? OFFSET ?
      `;

      // =========================
      // TOTAL DATA
      // =========================
      const [countRows] = await db.query(countSql);

      const totalData = countRows[0].total;
      const totalPage = Math.ceil(totalData / limit);

      // =========================
      // DATA
      // =========================
      const [rows] = await db.query(sql, [limit, offset]);

      // =========================
      // MESSAGE
      // =========================
      let message = "";

      if (rows.length === 0) {
        message = "Belum ada data permintaan pemeriksaan";
      } else {
        message = "Data permintaan pemeriksaan berhasil diambil";
      }

      res.status(200).json({
        success: true,
        message,
        pagination: {
          page,
          limit,
          totalData,
          totalPage,
        },
        data: rows,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

//GET permintaan_pemeriksaan BY PASIEN
router.get(
  "/:id_pasien/pasien",
  auth,
  allow("permintaan.pemeriksaan.read.pasien"),
  async (req, res) => {
    try {
      const { id_pasien } = req.params;

      // =========================
      // PAGINATION
      // =========================
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      // =========================
      // COUNT QUERY
      // =========================
      const countSql = `
        SELECT COUNT(*) AS total
        FROM permintaan_pemeriksaan pe
        INNER JOIN pasien p
          ON pe.id_pasien = p.id_pasien
        WHERE pe.id_pasien = ?
      `;

      // =========================
      // DATA QUERY
      // =========================
      const sql = `
        SELECT
          pe.id_permintaan_pemeriksaan,
          pe.tanggal_pemeriksaan,
          pe.keluhan,
          pe.status,
          
          TIME_FORMAT(pe.waktu_kunjungan_awal, '%H:%i') AS waktu_kunjungan_awal,
          TIME_FORMAT(pe.waktu_kunjungan_akhir, '%H:%i') AS waktu_kunjungan_akhir,
          p.nama AS nama_pasien
        FROM permintaan_pemeriksaan pe
        INNER JOIN pasien p
          ON pe.id_pasien = p.id_pasien
        WHERE pe.id_pasien = ?
        ORDER BY pe.id_permintaan_pemeriksaan DESC
        LIMIT ? OFFSET ?
      `;

      // =========================
      // TOTAL DATA
      // =========================
      const [countRows] = await db.query(countSql, [id_pasien]);

      const totalData = countRows[0].total;
      const totalPage = Math.ceil(totalData / limit);

      // =========================
      // DATA
      // =========================
      const [rows] = await db.query(sql, [id_pasien, limit, offset]);

      // =========================
      // MESSAGE
      // =========================
      let message = "";

      if (rows.length === 0) {
        message = "Pasien belum mempunyai data permintaan pemeriksaan";
      } else {
        message = "Data permintaan pemeriksaan berhasil diambil";
      }

      res.status(200).json({
        success: true,
        message,
        pagination: {
          page,
          limit,
          totalData,
          totalPage,
        },
        data: rows,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

router.post(
  "/",
  auth,
  allow("permintaan.pemeriksaan.create"),
  async (req, res) => {
    try {
      const { tanggal_pemeriksaan, keluhan } = req.body;

      if (!tanggal_pemeriksaan || !keluhan) {
        return res.status(400).json({
          success: false,
          message: "Data tidak boleh kosong",
        });
      }

      const [existingRequest] = await db.query(
        `
          SELECT
            id_permintaan_pemeriksaan,
            kode_permintaan_pemeriksaan,
            status
          FROM permintaan_pemeriksaan
          WHERE id_pasien = ?
            AND tanggal_pemeriksaan = ?
            AND status LIKE "menunggu pemeriksaan"
          LIMIT 1
        `,
        [req.user.id_relasi, tanggal_pemeriksaan],
      );

      if (existingRequest.length > 0) {
        return res.status(409).json({
          success: false,
          message:
            "Anda sudah memiliki permintaan pemeriksaan pada tanggal tersebut.",
        });
      }

      const [lastpermintaan_pemeriksaan] = await db.query(`
      SELECT kode_permintaan_pemeriksaan
        FROM permintaan_pemeriksaan
        ORDER BY id_permintaan_pemeriksaan DESC
        LIMIT 1
    `);

      let nextNumber = 1;

      if (lastpermintaan_pemeriksaan.length > 0) {
        const lastId =
          lastpermintaan_pemeriksaan[0].kode_permintaan_pemeriksaan;

        const lastNumber = parseInt(lastId.split("-")[2]);

        nextNumber = lastNumber + 1;
      }

      const today = new Date();

      const tahun = today.getFullYear();
      const bulan = String(today.getMonth() + 1).padStart(2, "0");
      const hari = String(today.getDate()).padStart(2, "0");

      const kode_permintaan_pemeriksaan =
        `PE-${tahun}${bulan}${hari}-` + String(nextNumber).padStart(4, "0");

      const sql = `
      INSERT INTO permintaan_pemeriksaan 
        (
            tanggal_pemeriksaan, 
            keluhan,
            id_pasien, 
            kode_permintaan_pemeriksaan
        ) 
        VALUES (?,?,?,?);
      `;

      const [result] = await db.query(sql, [
        tanggal_pemeriksaan,
        keluhan,
        req.user.id_relasi,
        kode_permintaan_pemeriksaan,
      ]);

      res.status(201).json({
        success: true,
        message: "permintaan_pemeriksaan pemeriksaan berhasil",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

router.patch(
  "/:id_permintaan_pemeriksaan/disetujui",
  auth,
  allow("permintaan.pemeriksaan.patch.setuju"),
  async (req, res) => {
    try {
      const { waktu_kunjungan_awal, waktu_kunjungan_akhir } = req.body;

      const { id_permintaan_pemeriksaan } = req.params;

      console.log("REQUETS QUERY : ", req.body);

      // CHECK permintaan_pemeriksaan
      const [checkRows] = await db.query(
        `
        SELECT *
        FROM permintaan_pemeriksaan
        WHERE id_permintaan_pemeriksaan = ? AND status = "menunggu pemeriksaan"
        LIMIT 1
        `,
        [id_permintaan_pemeriksaan],
      );

      const targetUser = checkRows[0];

      if (checkRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "permintaan_pemeriksaan tidak ditemukan",
        });
      }

      const sql = `
        UPDATE permintaan_pemeriksaan
        SET status = "disetujui", waktu_kunjungan_awal = ?, waktu_kunjungan_akhir = ?
        WHERE id_permintaan_pemeriksaan = ?
      `;

      const [result] = await db.query(sql, [
        waktu_kunjungan_awal,
        waktu_kunjungan_akhir,
        id_permintaan_pemeriksaan,
      ]);

      return res.status(200).json({
        success: true,
        message: "permintaan_pemeriksaan berhasil disetujui",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

router.patch(
  "/:id_permintaan_pemeriksaan/dibatalkan",
  auth,
  allow("permintaan.pemeriksaan.patch.batal"),
  async (req, res) => {
    try {
      const { id_permintaan_pemeriksaan } = req.params;
      const { data } = req.body;

      if (!data || data == "") {
        return res.status(403).json({
          success: false,
          message: "Alasan harus ada",
        });
      }

      console.log("ID permintaan_pemeriksaan : ", id_permintaan_pemeriksaan);

      // CHECK permintaan_pemeriksaan
      const [checkRows] = await db.query(
        `
        SELECT
          id_permintaan_pemeriksaan,
          tanggal_pemeriksaan,
          kode_permintaan_pemeriksaan,
          status
        FROM permintaan_pemeriksaan
        WHERE id_permintaan_pemeriksaan = ?
          AND status IN ("menunggu pemeriksaan", "disetujui")
        LIMIT 1

        `,
        [id_permintaan_pemeriksaan],
      );

      const targetUser = checkRows[0];

      if (checkRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "permintaan_pemeriksaan tidak ditemukan",
        });
      }

      if (targetUser.status === "disetujui") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tanggalPemeriksaan = new Date(targetUser.tanggal_pemeriksaan);
        tanggalPemeriksaan.setHours(0, 0, 0, 0);

        const selisihHari =
          (tanggalPemeriksaan - today) / (1000 * 60 * 60 * 24);

        if (selisihHari <= 1) {
          return res.status(400).json({
            success: false,
            message:
              "Permintaan pemeriksaan tidak dapat dibatalkan H-1 atau pada hari pemeriksaan. Silakan datang ke UKS.",
          });
        }
      }

      const sql = `
        UPDATE permintaan_pemeriksaan
        SET status = "dibatalkan", alasan_perubahan= ? 
        WHERE id_permintaan_pemeriksaan = ?
      `;

      const [result] = await db.query(sql, [data, id_permintaan_pemeriksaan]);

      return res.status(200).json({
        success: true,
        message: "permintaan_pemeriksaan berhasil ditolak",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

router.patch(
  "/:id_permintaan_pemeriksaan/selesai",
  auth,
  allow("permintaan.pemeriksaan.patch.selesai"),
  async (req, res) => {
    try {
      const { waktu_kunjungan_awal, waktu_kunjungan_akhir } = req.body;

      const { id_permintaan_pemeriksaan } = req.params;

      console.log("REQUETS QUERY : ", req.body);

      // CHECK permintaan_pemeriksaan
      const [checkRows] = await db.query(
        `
        SELECT *
        FROM permintaan_pemeriksaan
        WHERE id_permintaan_pemeriksaan = ? AND status = "menunggu pemeriksaan"
        LIMIT 1
        `,
        [id_permintaan_pemeriksaan],
      );

      const targetUser = checkRows[0];

      if (checkRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "permintaan pemeriksaan tidak ditemukan",
        });
      }

      const sql = `
        UPDATE permintaan_pemeriksaan
        SET status = "selesai", waktu_kunjungan_awal = ?, waktu_kunjungan_akhir = ?
        WHERE id_permintaan_pemeriksaan = ?
      `;

      const [result] = await db.query(sql, [
        waktu_kunjungan_awal,
        waktu_kunjungan_akhir,
        id_permintaan_pemeriksaan,
      ]);

      return res.status(200).json({
        success: true,
        message: "permintaan_pemeriksaan berhasil diselesaikan",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

module.exports = router;
