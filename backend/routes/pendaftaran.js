const express = require("express");
const router = express.Router();

const { buildMeasurementData } = require("../helpers/pengukuranHelper.js");

const db = require("../db");
const auth = require("../middleware/auth");
const allow = require("../middleware/permission");
const createAuditLog = require("../utils/auditLogs");

router.get("/", auth, allow("pendaftaran.read"), async (req, res) => {
  try {
    const sql = `
        SELECT pe.*, p.nama as nama_pasien
        FROM pendaftaran pe 
            INNER JOIN pasien p ON pe.id_pasien = p.id_pasien 
        ORDER BY pe.id_pendaftaran DESC;
      `;

    const [rows] = await db.query(sql);
    let message = "";
    if (rows.length == 0) {
      message = "Belum adaa data pendaftaran";
    } else {
      message =
        "Berhasil mengambil daftar sesi yang menunggu pemeriksaan dokter.";
    }

    res.status(200).json({
      success: true,
      message: message,
      data: rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/checkin", auth, allow("pendaftaran.read"), async (req, res) => {
  try {
    console.log("MASUK CHECK IN");
    const sql = `
        SELECT pe.id_pendaftaran, pe.kode_pendaftaran, pe.tanggal_pemeriksaan, pe.keluhan ,p.id_pasien, p.nama
        FROM pendaftaran pe 
            INNER JOIN pasien p ON pe.id_pasien = p.id_pasien 
        WHERE pe.status LIKE "checkin"
        ORDER BY pe.id_pendaftaran DESC;
      `;

    const [rows] = await db.query(sql);

    res.status(200).json({
      success: true,
      message: "Berhasil mengambil daftar Pendaftaran pasien yang check in.",
      data: rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get(
  "/:id_pendaftaran",
  auth,
  allow("pendaftaran.read"),
  async (req, res) => {
    try {
      const { id_pendaftaran } = req.params;

      const sql = `
        SELECT pe.*, p.id_pasien, p.nama as nama_pasien
        FROM pendaftaran pe
            INNER JOIN pasien p ON pe.id_pasien = p.id_pasien
        WHERE pe.id_pendaftaran = ?
      `;

      const [rows] = await db.query(sql, [id_pendaftaran]);

      res.status(200).json({
        success: true,
        message: "Berhasil mengambil detail pendaftaran.",
        data: rows,
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

//GET PENDAFTARAN BY PASIEN
router.get(
  "/:id_pasien/pasien",
  auth,
  allow("pendaftaran.read.pasien"),
  async (req, res) => {
    try {
      const { id_pasien } = req.params;

      const sql = `
            SELECT pe.*
            FROM pendaftaran pe 
                INNER JOIN pasien p on pe.id_pasien = p.id_pasien
            WHERE pe.id_pasien = ?
            ORDER BY pe.id_pendaftaran DESC;
      `;

      const [rows] = await db.query(sql, [id_pasien]);

      let message = "";
      if (rows.length == 0) {
        message = "Pasien belum mempunyai data pendaftaran";
      } else {
        message =
          "Berhasil mengambil daftar sesi yang menunggu pemeriksaan dokter.";
      }

      res.status(200).json({
        success: true,
        message: message,
        data: rows,
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

router.post("/", auth, allow("pendaftaran.create"), async (req, res) => {
  try {
    const { tanggal_pemeriksaan, keluhan } = req.body;
    console.log("REQUSET BODY : , ", req.body);
    console.log("REQUSET USER : , ", req.user);

    const [lastPendaftaran] = await db.query(`
      SELECT kode_pendaftaran
        FROM pendaftaran
        ORDER BY id_pendaftaran DESC
        LIMIT 1
    `);

    let nextNumber = 1;

    if (lastPendaftaran.length > 0) {
      const lastId = lastPendaftaran[0].kode_pendaftaran;

      const lastNumber = parseInt(lastId.split("-")[2]);

      nextNumber = lastNumber + 1;
    }

    const year = new Date().getFullYear();

    const kode_pendaftaran =
      `PE-${year}-` + String(nextNumber).padStart(4, "0");

    const sql = `
      INSERT INTO pendaftaran 
        (
            tanggal_pemeriksaan, 
            keluhan, 
            id_pasien, 
            kode_pendaftaran
        ) 
        VALUES (?,?,?,?);

    `;

    const [result] = await db.query(sql, [
      tanggal_pemeriksaan,
      keluhan,
      req.user.id_relasi,
      kode_pendaftaran,
    ]);

    res.status(201).json({
      success: true,
      message: "Pendaftaran pemeriksaan berhasil",
      //   data: {
      //     id_user: result.insertId,

      //   },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.patch(
  "/:id_pendaftaran/disetujui",
  auth,
  allow("pendaftaran.patch.setuju"),
  async (req, res) => {
    try {
      const { id_pendaftaran } = req.params;

      // CHECK PENDAFTARAN
      const [checkRows] = await db.query(
        `
        SELECT id_pendaftaran
        FROM pendaftaran
        WHERE id_pendaftaran = ? AND status = "menunggu"
        LIMIT 1
        `,
        [id_pendaftaran],
      );

      const targetUser = checkRows[0];

      if (checkRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pendaftaran tidak ditemukan",
        });
      }

      const sql = `
        UPDATE pendaftaran
        SET status = "disetujui"
        WHERE id_pendaftaran = ?
      `;

      const [result] = await db.query(sql, [id_pendaftaran]);

      return res.status(200).json({
        success: true,
        message: "Pendaftaran berhasil disetujui",
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
  "/:id_pendaftaran/ditolak",
  auth,
  allow("pendaftaran.patch.tolak"),
  async (req, res) => {
    try {
      const { id_pendaftaran } = req.params;
      const { data } = req.body;

      if (!data || data == "") {
        return res.status(403).json({
          success: false,
          message: "Alasan harus ada",
        });
      }

      // CHECK PENDAFTARAN
      const [checkRows] = await db.query(
        `
        SELECT *
        FROM pendaftaran
        WHERE id_pendaftaran = ? AND status = "menunggu"
        LIMIT 1
        `,
        [id_pendaftaran],
      );

      const targetUser = checkRows[0];

      if (checkRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pendaftaran tidak ditemukan",
        });
      }

      const sql = `
        UPDATE pendaftaran
        SET status = "ditolak", catatan_perawat= ? 
        WHERE id_pendaftaran = ?
      `;

      const [result] = await db.query(sql, [data, id_pendaftaran]);

      return res.status(200).json({
        success: true,
        message: "Pendaftaran berhasil ditolak",
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
  "/:id_pendaftaran/dibatalkan",
  auth,
  allow("pendaftaran.patch.batal"),
  async (req, res) => {
    try {
      const { id_pendaftaran } = req.params;
      const { data } = req.body;

      if (req.user.role === "perawat" || req.user.role === "super admin") {
        kolomCatatan = "catatan_perawat";
      } else if (req.user.role === "pasien") {
        kolomCatatan = "catatan_pasien";
      } else {
        return res.status(403).json({
          success: false,
          message: "Role tidak diizinkan",
        });
      }

      if (!data || data == "") {
        return res.status(403).json({
          success: false,
          message: "Alasan harus ada",
        });
      }

      console.log("ID PENDAFTARAN : ", id_pendaftaran);

      // CHECK PENDAFTARAN
      const [checkRows] = await db.query(
        `
        SELECT id_pendaftaran
        FROM pendaftaran
        WHERE id_pendaftaran = ? AND status = "menunggu"
        LIMIT 1
        `,
        [id_pendaftaran],
      );

      const targetUser = checkRows[0];

      if (checkRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pendaftaran tidak ditemukan",
        });
      }

      const sql = `
        UPDATE pendaftaran
        SET status = "dibatalkan", ${kolomCatatan}= ? 
        WHERE id_pendaftaran = ?
      `;

      const [result] = await db.query(sql, [data, id_pendaftaran]);

      return res.status(200).json({
        success: true,
        message: "Pendaftaran berhasil ditolak",
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
  "/:id_pendaftaran/check-in",
  auth,
  allow("pendaftaran.patch.check-in"),
  async (req, res) => {
    try {
      const { id_pendaftaran } = req.params;

      if (req.user.role != "perawat") {
        return res.status(403).json({
          success: false,
          message: "Role tidak diizinkan",
        });
      }

      // CHECK PENDAFTARAN
      const [checkRows] = await db.query(
        `
        SELECT *
        FROM pendaftaran
        WHERE id_pendaftaran = ? AND status = "disetujui"
        LIMIT 1
        `,
        [id_pendaftaran],
      );

      const targetPendaftaran = checkRows[0];

      if (checkRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pendaftaran tidak ditemukan",
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tanggalPemeriksaan = new Date(
        targetPendaftaran.tanggal_pemeriksaan,
      );
      tanggalPemeriksaan.setHours(0, 0, 0, 0);

      if (tanggalPemeriksaan.getTime() !== today.getTime()) {
        return res.status(400).json({
          success: false,
          message: "Check-in hanya dapat dilakukan pada tanggal pemeriksaan.",
        });
      }

      const sql = `
        UPDATE pendaftaran
        SET status = "checkin"
        WHERE id_pendaftaran = ?
      `;

      const [result] = await db.query(sql, [id_pendaftaran]);

      return res.status(200).json({
        success: true,
        message: "Pendaftaran berhasil ditolak",
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
  "/:id_pendaftaran/selesai",
  auth,
  allow("pendaftaran.patch.setuju"),
  async (req, res) => {
    try {
      const { id_pendaftaran } = req.params;

      // CHECK PENDAFTARAN
      const [checkRows] = await db.query(
        `
        SELECT id_pendaftaran
        FROM pendaftaran
        WHERE id_pendaftaran = ? AND status = "checkin"
        LIMIT 1
        `,
        [id_pendaftaran],
      );

      const targetUser = checkRows[0];

      if (checkRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pendaftaran tidak ditemukan",
        });
      }

      const sql = `
        UPDATE pendaftaran
        SET status = "selesai"
        WHERE id_pendaftaran = ?
      `;

      const [result] = await db.query(sql, [id_pendaftaran]);

      return res.status(200).json({
        success: true,
        message: "Pendaftaran berhasil selesai",
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
