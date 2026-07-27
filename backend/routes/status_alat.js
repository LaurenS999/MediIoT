const express = require("express");

const router = express.Router();

const db = require("../db");
const auth = require("../middleware/auth.js");
const allow = require("../middleware/permission");

router.get("/", auth, allow("pengukuran.read"), async (req, res) => {
  try {
    const sql = `
        SELECT mac_address
        FROM status_alat
      `;

    const [rows] = await db.query(sql);

    res.status(200).json({
      success: true,
      data: rows.map((item) => item.mac_address),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/* ======================================================
   CREATE STATUS ALAT
====================================================== */
router.post("/", auth, allow("pengukuran.create"), async (req, res) => {
  try {
    const { mac_address, device_function } = req.body;
    // VALIDASI
    if (mac_address === "" || device_function === "") {
      return res.status(400).json({
        success: false,
        message: "Mac Address atau Device function tidak valid",
      });
    }

    const checkSql = `
        SELECT id
        FROM status_alat
        WHERE mac_address = ?
    `;

    const [existing] = await db.query(checkSql, [mac_address]);

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Alat sedang digunakan oleh pengguna lain",
      });
    }

    const sql = `
      INSERT INTO status_alat
        ( mac_address, device_function, id_user) VALUES (?,?,?)
    `;

    const [result] = await db.query(sql, [
      mac_address,
      device_function,
      req.user.id_user,
    ]);

    res.status(201).json({
      success: true,
      message: "Alat berhasil dilakukan",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

/* ======================================================
   DELETE STATUS ALAT
====================================================== */
router.delete("/", auth, allow("pengukuran.create"), async (req, res) => {
  try {
    console.log("REQUEST BODY DELETE :", req.body);
    const { mac_address } = req.body;

    // VALIDASI
    if (!mac_address) {
      return res.status(400).json({
        success: false,
        message: "Mac Address atau Device function tidak valid",
      });
    }
    console.log("USER ROLE : ", req.user.role);

    const sql = `
      DELETE FROM status_alat WHERE mac_address = ?
    `;

    const [result] = await db.query(sql, [mac_address]);

    res.status(201).json({
      success: true,
      message: "Alat berhasil dihapus",
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
  "/heartbeat",
  auth,
  allow("pengukuran.create"),
  async (req, res) => {
    try {
      const { mac_address } = req.body;

      // VALIDASI
      if (!mac_address || mac_address.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Mac Address tidak valid",
        });
      }

      const sql = `
        UPDATE status_alat
        SET terakhir_aktif_pada = NOW()
        WHERE mac_address = ?
      `;

      const [result] = await db.query(sql, [mac_address]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Status alat tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "terakhir_aktif_pada berhasil diperbarui",
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
