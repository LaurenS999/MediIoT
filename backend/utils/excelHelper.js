// utils/excelHelper.js

function addChart(workbook, worksheet, title, chartBuffer) {
  // Judul grafik
  worksheet.addRow([]);
  worksheet.addRow([title]);

  worksheet.lastRow.font = {
    bold: true,
    size: 14,
  };

  // Tambahkan gambar ke workbook
  const imageId = workbook.addImage({
    buffer: chartBuffer,
    extension: "png",
  });

  // Tempel gambar
  worksheet.addImage(imageId, {
    tl: {
      col: 0,
      row: worksheet.rowCount,
    },
    ext: {
      width: 700,
      height: 300,
    },
  });

  // Beri ruang supaya grafik berikutnya tidak bertabrakan
  for (let i = 0; i < 18; i++) {
    worksheet.addRow([]);
  }
}

module.exports = {
  addChart,
};
