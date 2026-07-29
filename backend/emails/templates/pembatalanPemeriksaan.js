function templatePembatalanPemeriksaan({
  kodePermintaan,
  tanggalPemeriksaan,
  alasan,
}) {
  return {
    subject: `Pembatalan Permintaan Pemeriksaan - ${kodePermintaan}`,

    html: `
      <h2>Pembatalan Permintaan Pemeriksaan</h2>

      <p>
        Pasien telah membatalkan permintaan pemeriksaan berikut:
      </p>

      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <td><b>Kode Permintaan</b></td>
          <td>${kodePermintaan}</td>
        </tr>

        <tr>
          <td><b>Tanggal Pemeriksaan</b></td>
          <td>${tanggalPemeriksaan}</td>
        </tr>
        <tr>
          <td><b>Alasan Pembatalan</b></td>
          <td>${alasan}</td>
        </tr>
      </table>

      <br>

      <p>
        Silakan membuka aplikasi MediIoT untuk melihat
        detail permintaan tersebut.
      </p>

      <hr>

      <p style="color: #777;">
        Email ini dikirim secara otomatis oleh sistem MediIoT.
      </p>
    `,
  };
}

module.exports = templatePembatalanPemeriksaan;
