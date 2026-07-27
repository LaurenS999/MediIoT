const addChart = async (workbook, worksheet, title, buffer) => {
  worksheet.addRow([]);
  worksheet.addRow([title]);

  worksheet.lastRow.font = {
    bold: true,
    size: 14,
  };

  const imageId = workbook.addImage({
    buffer,
    extension: "png",
  });

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

  // Beri ruang agar grafik berikutnya tidak menimpa
  for (let i = 0; i < 18; i++) {
    worksheet.addRow([]);
  }
};
