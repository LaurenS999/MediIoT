const express = require("express");
const router = express.Router();
const db = require("../db.js");
const ExcelJS = require("exceljs");
const auth = require("../middleware/auth.js");
const allow = require("../middleware/permission.js");
const createAuditLog = require("../utils/auditLogs");
const { addChart } = require("../utils/excelHelper");

const {
  generateWeightChart,
  generateBloodPressureChart,
  generateBodyFatChart,
  generateMuscleChart,
} = require("../utils/chartGenerator");

// ======================================================
// EXPORT EXCEL LAPORAN PASIEN
// ======================================================

router.get(
  "/pasien/:id_pasien/:id_user",
  // auth,
  // allow("laporan.pasien.export"),
  async (req, res) => {
    try {
      const { id_pasien, id_user } = req.params;

      // ======================================================
      // DATA PASIEN
      // ======================================================

      const sqlPasien = `
      SELECT 
        nama, alamat, tanggal_lahir, tempat_lahir, jenis_kelamin, email, no_telp, tanggal_pendaftaran
      FROM pasien
      WHERE id_pasien = ? AND status_delete = 0
    `;

      const [pasienRows] = await db.query(sqlPasien, [id_pasien]);

      if (pasienRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Pasien tidak ditemukan",
        });
      }

      const pasien = pasienRows[0];

      // ======================================================
      // DATA PENGUKURAN
      // ======================================================

      const sqlPengukuran = `
      SELECT
              p.id_pasien,
              p.nama,
              p.jenis_kelamin,
              p.status_delete,

              TIMESTAMPDIFF(
                  YEAR,
                  p.tanggal_lahir,
                  CURDATE()
              ) AS umur,

              sp.dibuat_pada,

              temp.suhu,

              CONCAT(
                  COALESCE(t.systolic, '-'),
                  '/',
                  COALESCE(t.diastolic, '-')
              ) AS tekanan_darah,

              COALESCE(o.denyut_nadi, t.denyut_nadi) AS denyut_nadi,
              COALESCE(o.spo2, t.spo2) AS spo2,

              b.berat,
              b.tinggi_badan,
              b.bmi,
              b.body_fat,
              b.muscle_mass,
              b.water,
              b.visceral_fat,
              b.bone,
              b.metabolism,
              b.protein,
              b.body_age,
              b.lbm

          FROM pasien p

          LEFT JOIN kunjungan k
              ON k.id_pasien = p.id_pasien

          LEFT JOIN sesi_pengukuran sp
              ON sp.id_pengukuran = k.id_pengukuran

          LEFT JOIN pengukuran_suhu temp
              ON temp.id_sesi = sp.id_pengukuran

          LEFT JOIN pengukuran_tensi t
              ON t.id_sesi = sp.id_pengukuran

          LEFT JOIN pengukuran_oxy o
              ON o.id_sesi = sp.id_pengukuran

          LEFT JOIN pengukuran_bmi b
              ON b.id_sesi = sp.id_pengukuran

      WHERE p.id_pasien = ? 
      ORDER BY k.dibuat_pada DESC
      LIMIT 25
    `;

      const [pengukuranRows] = await db.query(sqlPengukuran, [id_pasien]);

      const weightChart = await generateWeightChart(pengukuranRows);
      const bloodPressureChart =
        await generateBloodPressureChart(pengukuranRows);
      const bodyFatChart = await generateBodyFatChart(pengukuranRows);
      const muscleChart = await generateMuscleChart(pengukuranRows);

      // ======================================================
      // EXCEL
      // ======================================================

      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("Hasil Pengukuran");

      const weightChartId = workbook.addImage({
        buffer: weightChart,
        extension: "png",
      });

      const bloodPressureChartId = workbook.addImage({
        buffer: bloodPressureChart,
        extension: "png",
      });

      const bodyFatChartId = workbook.addImage({
        buffer: bodyFatChart,
        extension: "png",
      });

      const muscleChartId = workbook.addImage({
        buffer: muscleChart,
        extension: "png",
      });

      // ======================================================
      // WIDTH COLUMN
      // ======================================================

      worksheet.columns = [
        { key: "suhu" },
        { key: "tekanan_darah" },
        { key: "denyut_nadi" },
        { key: "spo2" },
        { key: "berat" },
        { key: "tinggi" },
        { key: "bmi" },
        { key: "body_fat" },
        { key: "muscle_mass" },
        { key: "water" },
        { key: "visceral_fat" },
        { key: "bone" },
        { key: "metabolism" },
        { key: "protein" },
        { key: "body_age" },
        { key: "lbm" },
        { key: "tanggal" },
      ];

      // ======================================================
      // TITLE
      // ======================================================

      worksheet.mergeCells("A1:I1");

      const titleCell = worksheet.getCell("A1");

      titleCell.value = "LAPORAN HASIL PENGUKURAN PASIEN";

      titleCell.font = {
        size: 18,
        bold: true,
      };

      titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getRow(1).height = 30;

      // ======================================================
      // DATA PASIEN
      // ======================================================

      worksheet.getCell("A3").value = "DATA PASIEN";

      worksheet.getCell("A3").font = {
        bold: true,
        size: 14,
        color: { argb: "1F4E78" },
      };

      worksheet.addRow([]);

      worksheet.addRow(["Nama", pasien.nama]);

      worksheet.addRow(["Jenis Kelamin", pasien.jenis_kelamin]);

      worksheet.addRow([
        "Tanggal Lahir",
        new Date(pasien.tanggal_lahir).toLocaleDateString("id-ID"),
      ]);
      worksheet.addRow(["Tempat Lahir", pasien.tempat_lahir]);
      worksheet.addRow(["Email", pasien.email]);
      worksheet.addRow(["no Telpon", pasien.no_telp]);
      worksheet.addRow(["Alamat", pasien.alamat]);

      // ======================================================
      // STYLE DATA PASIEN
      // ======================================================

      for (let i = 5; i <= 11; i++) {
        ["A", "B"].forEach((col) => {
          const cell = worksheet.getCell(`${col}${i}`);

          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };

          cell.alignment = {
            vertical: "middle",
          };

          if (col === "A") {
            cell.font = {
              bold: true,
            };

            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "DCE6F1" },
            };
          }
        });
      }

      // ======================================================
      // SPACING
      // ======================================================

      worksheet.addRow([]);
      worksheet.addRow([]);

      // ======================================================
      // HEADER TABLE
      // ======================================================

      const headerRow = worksheet.addRow([
        "Suhu (°C)",
        "Tekanan Darah (mmHg)",
        "Denyut Nadi (bpm)",
        "SpO2 (%)",
        "Berat (kg)",
        "Tinggi (cm)",
        "BMI",
        "Body Fat (%)",
        "Muscle Mass (kg)",
        "Water (%)",
        "Visceral Fat",
        "Bone (kg)",
        "Metabolism (kcal)",
        "Protein (%)",
        "Body Age",
        "LBM (kg)",
        "Tanggal Pengukuran",
      ]);

      headerRow.eachCell((cell, colNumber) => {
        const headerLength = cell.value.toString().length;

        worksheet.getColumn(colNumber).width = headerLength + 5;
      });

      // ======================================================
      // STYLE HEADER TABLE
      // ======================================================

      headerRow.eachCell((cell) => {
        cell.font = {
          bold: true,
          color: { argb: "FFFFFF" },
        };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "1F4E78" },
        };

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // ======================================================
      // DATA TABLE
      // ======================================================

      console.log(pengukuranRows);

      pengukuranRows.forEach((item) => {
        const tanggal = item.dibuat_pada
          ? new Date(item.dibuat_pada).toLocaleDateString("id-ID")
          : "";

        const row = worksheet.addRow([
          item.suhu || "",
          item.tekanan_darah === "-/-" ? "" : item.tekanan_darah || "",
          item.denyut_nadi || "",
          item.spo2 || "",
          item.berat || "",
          item.tinggi_badan || "",
          item.bmi || "",
          item.body_fat || "",
          item.muscle_mass || "",
          item.water || "",
          item.visceral_fat || "",
          item.bone || "",
          item.metabolism || "",
          item.protein || "",
          item.body_age || "",
          item.lbm || "",
          tanggal,
        ]);

        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };

          cell.alignment = {
            horizontal: "center",
            vertical: "middle",
          };
        });
      });

      // ======================================================
      // FOOTER
      // ======================================================

      worksheet.addRow([]);
      worksheet.addRow([]);

      const footerRow = worksheet.addRow([
        `Dicetak pada: ${new Date().toLocaleString("id-ID")}`,
      ]);

      footerRow.font = {
        italic: true,
        color: { argb: "666666" },
      };

      worksheet.addRow([]);
      worksheet.addRow([]);

      addChart(workbook, worksheet, "Trend Berat Badan", weightChart);

      addChart(workbook, worksheet, "Trend Tekanan Darah", bloodPressureChart);

      addChart(workbook, worksheet, "Trend Body Fat", bodyFatChart);

      addChart(workbook, worksheet, "Trend Muscle Mass", muscleChart);

      // ======================================================
      // RESPONSE
      // ======================================================

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=hasil-pengukuran-${id_pasien}.xlsx`,
      );

      await workbook.xlsx.write(res);

      res.end();

      await createAuditLog({
        id_user: id_user,
        action: `EXPORT_LAPORAN_PASIEN_${id_pasien}`,
      });
    } catch (error) {
      console.error(error);

      if (error.code == "ECONNREFUSED") {
        return res.status(500).json({
          success: false,
          message: "Server tidak terjangkau",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Gagal export excel",
      });
    }
  },
);

router.get(
  "/pengukuran/:id_user",
  // auth, allow("laporan.export"),
  async (req, res) => {
    const { id_user } = req.params;

    console.log("ID USER : ", id_user);

    try {
      // =====================================================
      // QUERY DATA
      // =====================================================

      const sql = `
        SELECT
              p.id_pasien,
              p.nama,
              p.jenis_kelamin,
              p.status_delete,

              TIMESTAMPDIFF(
                  YEAR,
                  p.tanggal_lahir,
                  CURDATE()
              ) AS umur,

              sp.dibuat_pada,

              temp.suhu,

              CONCAT(
                  COALESCE(t.systolic, '-'),
                  '/',
                  COALESCE(t.diastolic, '-')
              ) AS tekanan_darah,

              COALESCE(o.denyut_nadi, t.denyut_nadi) AS denyut_nadi,
              COALESCE(o.spo2, t.spo2) AS spo2,

              b.berat,
              b.tinggi_badan,
              b.bmi,
              b.body_fat,
              b.muscle_mass,
              b.water,
              b.visceral_fat,
              b.bone,
              b.metabolism,
              b.protein,
              b.body_age,
              b.lbm

          FROM pasien p

          LEFT JOIN kunjungan k
              ON k.id_kunjungan = (
                  SELECT k2.id_kunjungan
                  FROM kunjungan k2
                  WHERE k2.id_pasien = p.id_pasien
                  ORDER BY k2.dibuat_pada DESC
                  LIMIT 1
              )

          LEFT JOIN sesi_pengukuran sp
              ON sp.id_pengukuran = k.id_pengukuran

          LEFT JOIN pengukuran_suhu temp
              ON temp.id_sesi = sp.id_pengukuran

          LEFT JOIN pengukuran_tensi t
              ON t.id_sesi = sp.id_pengukuran

          LEFT JOIN pengukuran_oxy o
              ON o.id_sesi = sp.id_pengukuran

          LEFT JOIN pengukuran_bmi b
              ON b.id_sesi = sp.id_pengukuran

          WHERE p.status_delete = 0

          ORDER BY p.nama ASC;
    `;

      const [rows] = await db.query(sql);

      // =====================================================
      // WORKBOOK
      // =====================================================
      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("Laporan Pengukuran Terakhir");

      // =====================================================
      // TITLE
      // =====================================================

      worksheet.mergeCells("A1:K1");

      const titleCell = worksheet.getCell("A1");

      titleCell.value = "LAPORAN PENGUKURAN TERAKHIR PASIEN";

      titleCell.font = {
        size: 18,
        bold: true,
      };

      titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getRow(1).height = 28;

      // =====================================================
      // HEADER TABLE
      // =====================================================

      const headerRow = worksheet.addRow([
        "Nama",
        "Gender",
        "Umur",
        "Suhu (°C)",
        "SpO2 (%)",
        "Denyut Nadi (bpm)",
        "Tekanan Darah (mmHg)",
        "Berat (kg)",
        "Tinggi (cm)",
        "BMI",
        "Body Fat (%)",
        "Muscle Mass (kg)",
        "Water (%)",
        "Visceral Fat",
        "Bone (kg)",
        "Metabolism (kcal)",
        "Protein (%)",
        "Body Age",
        "LBM (kg)",
        "Tanggal Pengukuran",
      ]);

      headerRow.font = {
        bold: true,
        color: { argb: "FFFFFF" },
      };

      headerRow.alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E40AF" },
      };

      headerRow.height = 24;

      // =====================================================
      // COLUMN WIDTH
      // =====================================================

      worksheet.columns = [
        { key: "nama", width: 30 },
        { key: "gender", width: 15 },
        { key: "umur", width: 10 },
        { key: "suhu", width: 12 },
        { key: "SpO2", width: 12 },
        { key: "Denyut Nadi", width: 25 },
        { key: "tekanan_darah", width: 25 },
        { key: "berat", width: 12 },
        { key: "tinggi", width: 12 },
        { key: "bmi", width: 12 },
        { key: "body_fat", width: 15 },
        { key: "muscle_mass", width: 25 },
        { key: "water", width: 15 },
        { key: "visceral_fat", width: 15 },
        { key: "bone", width: 15 },
        { key: "metabolism", width: 25 },
        { key: "protein", width: 15 },
        { key: "body_age", width: 15 },
        { key: "lbm", width: 15 },
        { key: "tanggal", width: 25 },
      ];

      // =====================================================
      // DATA ROWS
      // =====================================================

      rows.forEach((item) => {
        worksheet.addRow([
          item.nama || "",
          item.jenis_kelamin || "",
          item.umur || "",
          item.suhu || "",
          item.spo2 || "",
          item.denyut_nadi || "",
          item.tekanan_darah === "-/-" ? "" : item.tekanan_darah || "",
          item.berat || "",
          item.tinggi_badan || "",
          item.bmi || "",
          item.body_fat || "",
          item.muscle_mass || "",
          item.water || "",
          item.visceral_fat || "",
          item.bone || "",
          item.metabolism || "",
          item.protein || "",
          item.body_age || "",
          item.lbm || "",
          item.dibuat_pada || "",
        ]);
      });

      // =====================================================
      // STYLE ALL CELLS
      // =====================================================

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          // BORDER
          cell.border = {
            top: {
              style: "thin",
              color: { argb: "D1D5DB" },
            },
            left: {
              style: "thin",
              color: { argb: "D1D5DB" },
            },
            bottom: {
              style: "thin",
              color: { argb: "D1D5DB" },
            },
            right: {
              style: "thin",
              color: { argb: "D1D5DB" },
            },
          };

          // ALIGNMENT
          cell.alignment = {
            vertical: "middle",
            horizontal: rowNumber === 2 ? "center" : "left",
          };

          // DATA ROW STYLE
          if (rowNumber >= 3) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: {
                argb: rowNumber % 2 === 0 ? "F9FAFB" : "FFFFFF",
              },
            };
          }
        });
      });

      // =====================================================
      // FREEZE HEADER
      // =====================================================

      worksheet.views = [
        {
          state: "frozen",
          ySplit: 2,
        },
      ];

      // =====================================================
      // RESPONSE
      // =====================================================

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=laporan-pengukuran-terakhir.xlsx",
      );

      // TAMBAHKAN BARIS INI:
      res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

      await workbook.xlsx.write(res);
      res.end();

      await createAuditLog({
        id_user: id_user,
        action: `EXPORT_LAPORAN_PENGUKURAN`,
      });
    } catch (error) {
      console.error(error);

      if (error.code == "ECONNREFUSED") {
        return res.status(500).json({
          success: false,
          message: "Server tidak terjangkau",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Gagal export laporan",
      });
    }
  },
);

module.exports = router;
