function templatePenolakanPemeriksaan({
  kodePermintaan,
  tanggalPemeriksaan,
  alasan,
}) {
  return {
    subject: `Permintaan Pemeriksaan Ditolak - ${kodePermintaan}`,

    html: `
      <h2>Permintaan Pemeriksaan Ditolak</h2>

      <p>
        Permintaan pemeriksaan Anda tidak dapat dipenuhi
        oleh petugas medis.
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
          <td><b>Alasan Penolakan</b></td>
          <td>${alasan}</td>
        </tr>
      </table>

      <br>

      <p>
        Silakan menghubungi petugas medis apabila membutuhkan
        informasi lebih lanjut.
      </p>

      <hr>

      <p style="color: #777;">
        Email ini dikirim secara otomatis oleh sistem MediIoT.
      </p>
    `,
  };
}

module.exports = templatePenolakanPemeriksaan;
