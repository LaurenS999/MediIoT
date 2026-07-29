function templatePermintaanPemeriksaan({
  kodePermintaan,
  tanggalPemeriksaan,
  keluhan,
  jamPemeriksaan,
}) {
  return {
    subject: `Permintaan Pemeriksaan Baru - ${kodePermintaan}`,

    html: `
      <h2>Permintaan Pemeriksaan Baru</h2>

      <p>
        Terdapat permintaan pemeriksaan baru yang dijadwalkan
        untuk hari ini.
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
          <td><b>Jam Pemeriksaan</b></td>
          <td>${jamPemeriksaan}</td>
        </tr>

        <tr>
          <td><b>Keluhan</b></td>
          <td>${keluhan}</td>
        </tr>
      </table>

      <br>

      <p>
        Silakan membuka aplikasi MediIoT untuk melihat
        detail permintaan pemeriksaan.
      </p>

      <hr>

      <p style="color: #777;">
        Email ini dikirim secara otomatis oleh sistem MediIoT.
      </p>
    `,
  };
}

module.exports = templatePermintaanPemeriksaan;
