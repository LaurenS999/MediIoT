const express = require("express");
const router = express.Router();

const db = require("../db");
const auth = require("../middleware/auth.js");
const allow = require("../middleware/permission");

const upload = require("../middleware/uploadLampiran.js");

const fs = require("fs");
const path = require("path");

const kategoriValid = ["photo", "laboratory", "radiology", "ecg", "other"];

//GET LAMPIRAN UNTUK SATU KUNJUNGAN
router.get(
  "/:id_kunjungan",
  auth,
  allow("kunjungan.read"),
  async (req, res) => {
    try {
      const { id_kunjungan } = req.params;

      const [result] = await db.query(
        `
        SELECT
            id,
            id_kunjungan,
            kategori,
            nama_file,
            path_file,
            mime_type,
            ukuran_file,
            dibuat_pada
        FROM kunjungan_lampiran
        WHERE id_kunjungan = ?
        ORDER BY dibuat_pada DESC
        `,
        [id_kunjungan],
      );

      const data = result.map((item) => ({
        ...item,
        url: `${req.protocol}://${req.get("host")}/uploads/kunjungan/${item.path_file}`,
      }));

      res.json({
        success: true,
        data,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

//CREATE LAMPIRAN
router.post(
  "/",
  auth,
  allow("kunjungan.update"),
  upload.array("files", 10),

  async (req, res) => {
    const conn = await db.getConnection();
    console.log("FILES : ", req.files);

    try {
      const { id_kunjungan, kategori } = req.body;

      if (!id_kunjungan) {
        return res.status(400).json({
          success: false,
          message: "ID kunjungan wajib diisi",
        });
      }

      if (!kategori) {
        return res.status(400).json({
          success: false,
          message: "Kategori wajib diisi",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Tidak ada file yang diupload",
        });
      }

      let kategori_data = req.body.kategori;

      if (Array.isArray(kategori_data)) {
        kategori_data = kategori_data[0];
      }

      if (!kategoriValid.includes(kategori_data)) {
        return res.status(400).json({
          success: false,
          message: "Kategori tidak valid",
        });
      }

      const [kunjungan] = await conn.query(
        `
        SELECT kode_kunjungan
        FROM kunjungan
        WHERE id_kunjungan = ?
        `,
        [id_kunjungan],
      );

      if (kunjungan.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Kunjungan tidak ditemukan",
        });
      }

      const kodeKunjungan = kunjungan[0].kode_kunjungan;

      await conn.beginTransaction();

      const uploadedFiles = [];

      const path = require("path");

      const [[total]] = await conn.query(
        `
            SELECT COUNT(*) AS jumlah
            FROM kunjungan_lampiran
            WHERE id_kunjungan = ?
            AND kategori = ?
        `,
        [id_kunjungan, kategori[0]],
      );

      let nomor = total.jumlah;

      for (const file of req.files) {
        console.log("FILE : " + file);
        nomor++;

        const ext = path.extname(file.originalname).toLowerCase();
        const namaFile = `L-${kodeKunjungan}-${kategori[0]}-${String(nomor).padStart(2, "0")}${ext}`;

        await conn.query(
          `
        INSERT INTO kunjungan_lampiran
        (
            id_kunjungan,
            kategori,
            nama_file,
            path_file,
            mime_type,
            ukuran_file
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
          [
            id_kunjungan,
            kategori[0],
            namaFile,
            file.filename,
            file.mimetype,
            file.size,
          ],
        );

        uploadedFiles.push(file.filename);
      }

      await conn.commit();

      res.status(201).json({
        success: true,
        message: "Lampiran berhasil diupload",
        jumlah: req.files.length,
      });
    } catch (err) {
      await conn.rollback();

      if (req.files) {
        for (const file of req.files) {
          const filePath = path.join(
            __dirname,
            "../uploads/kunjungan",
            file.filename,
          );

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }

      console.error(err);

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    } finally {
      conn.release();
    }
  },
);

//DELETE LAMPIRAN
router.delete("/:id", auth, allow("kunjungan.update"), async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
        SELECT *
        FROM kunjungan_lampiran
        WHERE id = ?
        `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lampiran tidak ditemukan",
      });
    }

    const lampiran = rows[0];

    const filePath = path.join(
      __dirname,
      "../uploads/kunjungan",
      lampiran.path_file,
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await db.query(
      `
        DELETE FROM kunjungan_lampiran
        WHERE id = ?
        `,
      [id],
    );

    res.json({
      success: true,
      message: "Lampiran berhasil dihapus",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
