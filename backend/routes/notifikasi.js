const express = require("express");
const router = express.Router();

const { buildMeasurementData } = require("../helpers/pengukuranHelper.js");

const db = require("../db");
const auth = require("../middleware/auth");
const allow = require("../middleware/permission");
const createAuditLog = require("../utils/auditLogs");

router.get(
  "/dokter",
  auth,
  allow("notifikasi_dokter.read"),
  async (req, res) => {
    try {
      const sql_count = `
        SELECT COUNT(pm.id_pemeriksaan) as Jumlah_notif
        FROM sesi_pemeriksaan pm
        
        INNER JOIN kunjungan k
        	ON k.id_pemeriksaan = pm.id_pemeriksaan

        INNER JOIN pasien p
            ON p.id_pasien = k.id_pasien

        INNER JOIN user u
            ON k.id_perawat = u.id_user

        WHERE k.id_dokter is NULL
        ORDER BY k.dibuat_pada DESC
      `;

      const [count] = await db.query(sql_count);

      const sql = `
        SELECT
            pm.id_pemeriksaan,
            pm.kode_pemeriksaan,
            k.dibuat_pada,
            p.nama,
            u.username AS nama_perawat
        FROM sesi_pemeriksaan pm
        INNER JOIN kunjungan k
        	ON k.id_pemeriksaan = pm.id_pemeriksaan
        INNER JOIN pasien p
            ON p.id_pasien = k.id_pasien
        INNER JOIN user u
            ON k.id_perawat = u.id_user
        WHERE k.id_dokter is NULL
        ORDER BY k.dibuat_pada DESC
        LIMIT 5;
      `;

      const [rows] = await db.query(sql);

      res.status(200).json({
        success: true,
        message:
          "Berhasil mengambil daftar sesi yang menunggu pemeriksaan dokter.",
        data: rows,
        jumlah: count[0],
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

router.get(
  "/perawat",
  auth,
  allow("notifikasi_perawat.read"),
  async (req, res) => {
    try {
      const sql_count = `
        SELECT COUNT(pe.id_permintaan_pemeriksaan) as Jumlah_notif
        FROM permintaan_pemeriksaan pe
          INNER JOIN pasien p
            ON p.id_pasien = pe.id_pasien
        WHERE pe.status LIKE "menunggu pemeriksaan"
        ORDER BY pe.dibuat_pada DESC
      `;

      const [count] = await db.query(sql_count);

      const sql = `
        SELECT
            pe.id_permintaan_pemeriksaan,
            pe.tanggal_pemeriksaan,
			      pe.status,
            pe.dibuat_pada,
            p.nama
        FROM permintaan_pemeriksaan pe
        INNER JOIN pasien p
            ON p.id_pasien = pe.id_pasien
        WHERE pe.status LIKE "menunggu pemeriksaan"
        ORDER BY pe.dibuat_pada DESC
        LIMIT 5;
      `;

      const [rows] = await db.query(sql);

      res.status(200).json({
        success: true,
        message: "Berhasil mengambil daftar Pasien yang meminta pemeriksaan.",
        data: rows,
        jumlah: count[0],
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

module.exports = router;
