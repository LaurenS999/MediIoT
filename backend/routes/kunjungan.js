const express = require("express");

const router = express.Router();

const db = require("../db");
const auth = require("../middleware/auth.js");
const allow = require("../middleware/permission");
const createAuditLog = require("../utils/auditLogs");
const { buildMeasurementData } = require("../helpers/pengukuranHelper.js");

//GET LIST KUNJUNGAN
router.get("/", auth, allow("kunjungan.read"), async (req, res) => {
  try {
    let { search } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    console.log("PAGE : ", req.query.page);
    let whereClause = "";
    let params = [];

    if (search.trim() !== "") {
      whereClause = `
        WHERE (
          p.nama LIKE ?
          OR k.kode_kunjungan LIKE ?
          OR dokter.username LIKE ?
          OR perawat.username LIKE ?
        )
      `;

      const keyword = `%${search}%`;

      params.push(keyword, keyword, keyword, keyword);
    }

    // ===========================
    // Hitung total data
    // ===========================

    const countSql = `
      SELECT COUNT(*) AS total
      FROM kunjungan k

      JOIN pasien p
        ON p.id_pasien = k.id_pasien

      LEFT JOIN user perawat
        ON perawat.id_user = k.id_perawat

      LEFT JOIN user dokter
        ON dokter.id_user = k.id_dokter

      ${whereClause}
    `;

    const [countResult] = await db.query(countSql, params);

    const totalData = countResult[0].total;
    const totalPage = Math.ceil(totalData / limit);

    // ===========================
    // Ambil data
    // ===========================

    const dataSql = `
      SELECT
          k.id_kunjungan,
          k.kode_kunjungan,
          k.id_pemeriksaan,
          k.id_pengukuran,
          p.nama,
          p.id_pasien,
          p.jenis_kelamin,
          perawat.username AS nama_perawat,
          dokter.id_user AS id_dokter,
          dokter.username AS nama_dokter,
          k.dibuat_pada AS tanggal_kunjungan

      FROM kunjungan k

      JOIN pasien p
        ON p.id_pasien = k.id_pasien

      LEFT JOIN user perawat
        ON perawat.id_user = k.id_perawat

      LEFT JOIN user dokter
        ON dokter.id_user = k.id_dokter

      ${whereClause}

      ORDER BY k.dibuat_pada DESC

      LIMIT ?
      OFFSET ?
    `;

    const dataParams = [...params, limit, offset];

    const [result] = await db.query(dataSql, dataParams);

    res.status(200).json({
      success: true,
      // data: [],
      data: result,
      pagination: {
        page,
        limit,
        totalData,
        totalPage,
      },
    });
  } catch (error) {
    console.log(error);

    if (error.code == "ECONNREFUSED") {
      return res.status(500).json({
        success: false,
        message: "Server tidak terjangkau",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/:id_pasien", auth, allow("kunjungan.read"), async (req, res) => {
  try {
    const { id_pasien } = req.params;

    const sql = `
        SELECT
            k.id_kunjungan,
            k.kode_kunjungan,
            k.id_pemeriksaan,
            k.id_pengukuran,
            
            perawat.username AS nama_perawat,
            dokter.id_user as id_dokter,
            dokter.username AS nama_dokter,
            k.dibuat_pada as tanggal_kunjungan
        FROM kunjungan k

        JOIN pasien p
        ON p.id_pasien = k.id_pasien

        LEFT JOIN user perawat
        ON perawat.id_user = k.id_perawat

        LEFT JOIN user dokter
        ON dokter.id_user = k.id_dokter

        WHERE k.id_pasien = ?
        ORDER BY k.dibuat_pada DESC
      `;

    const [result] = await db.query(sql, [id_pasien]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//AMBIL PENGUKURAN DAN PEMERIKSAAN DARI KUNJUNGA TERAKHIR PASIEN
router.get(
  "/:id_pasien/kunjungan-terakhir",
  auth,
  allow("kunjungan.read"),
  async (req, res) => {
    try {
      const { id_pasien } = req.params;

      // ==========================================
      // AMBIL KUNJUNGAN TERAKHIR
      // ==========================================
      const sql = `
        SELECT *
        FROM kunjungan
        WHERE id_pasien = ?
        ORDER BY dibuat_pada DESC
        LIMIT 1
      `;

      const [kunjungan] = await db.query(sql, [id_pasien]);
      console.log("KUNJUNGAN : ", kunjungan);

      // ==========================================
      // BELUM ADA KUNJUNGAN
      // ==========================================
      if (kunjungan.length === 0) {
        return res.status(200).json({
          success: true,
          message: "Pasien belum memiliki riwayat kunjungan",
          data: {
            kunjungan: null,
            pemeriksaan: null,
            pengukuran: null,
          },
        });
      }

      const dataKunjungan = kunjungan[0];

      // ==========================================
      // DATA PEMERIKSAAN
      // ==========================================
      let dataPemeriksaan = null;

      if (dataKunjungan.id_pemeriksaan) {
        const sqlPemeriksaan = `
          SELECT *
          FROM sesi_pemeriksaan
          WHERE id_pemeriksaan = ?
        `;

        const [resultPemeriksaan] = await db.query(sqlPemeriksaan, [
          dataKunjungan.id_pemeriksaan,
        ]);

        if (resultPemeriksaan.length > 0) {
          dataPemeriksaan = resultPemeriksaan[0];
        }
      }

      // ==========================================
      // DATA PENGUKURAN
      // ==========================================
      let dataPengukuran = null;

      if (dataKunjungan.id_pengukuran) {
        dataPengukuran = await buildMeasurementData(
          dataKunjungan.id_pengukuran,
        );
      }

      // ==========================================
      // RESPONSE
      // ==========================================
      res.status(200).json({
        success: true,
        message: "Data kunjungan terakhir berhasil diambil",
        data: {
          kunjungan: dataKunjungan,
          pemeriksaan: dataPemeriksaan,
          pengukuran: dataPengukuran,
        },
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

//AMBIL PENGUKURAN DAN PEMERIKSAAN DARI KUNJUNGA TERAKHIR PASIEN
router.get(
  "/:id_pasien/riwayat-kunjungan",
  auth,
  allow("kunjungan.read"),
  async (req, res) => {
    try {
      const { id_pasien } = req.params;
      const { id_pengukuran, id_pemeriksaan } = req.query;

      // ==========================================
      // DATA PEMERIKSAAN
      // ==========================================
      let dataPemeriksaan = null;

      if (id_pemeriksaan != null) {
        const sqlPemeriksaan = `
          SELECT *
          FROM sesi_pemeriksaan
          WHERE id_pemeriksaan = ?
        `;

        const [resultPemeriksaan] = await db.query(sqlPemeriksaan, [
          id_pemeriksaan,
        ]);

        if (resultPemeriksaan.length > 0) {
          dataPemeriksaan = resultPemeriksaan[0];
        }
      }

      // ==========================================
      // DATA PENGUKURAN
      // ==========================================
      let dataPengukuran = null;

      if (id_pengukuran != null) {
        dataPengukuran = await buildMeasurementData(id_pengukuran);
      }

      // ==========================================
      // RESPONSE
      // ==========================================
      res.status(200).json({
        success: true,
        message: "Data kunjungan terakhir berhasil diambil",
        data: {
          pemeriksaan: dataPemeriksaan,
          pengukuran: dataPengukuran,
        },
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

module.exports = router;
