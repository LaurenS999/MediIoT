function templateDaftarPemeriksaanBesok(daftarPermintaan) {
  const rows = daftarPermintaan
    .map(
      (item) => `
        <tr>
          <td>${item.kodePermintaan}</td>
          <td>${item.namaPasien}</td>
          <td>${item.tanggalPemeriksaan}</td>
          <td>${item.keluhan}</td>
        </tr>
      `,
    )
    .join("");

  return {
    subject: "Daftar Permintaan Pemeriksaan Besok",

    html: `
      <h2>Daftar Permintaan Pemeriksaan Besok</h2>

      <p>
        Berikut adalah daftar pasien yang memiliki
        permintaan pemeriksaan untuk besok.
      </p>

      <table border="1" cellpadding="8" cellspacing="0">
        <thead>
          <tr>
            <th>Kode Permintaan</th>
            <th>Pasien</th>
            <th>Tanggal Pemeriksaan</th>
            <th>Keluhan</th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>
      </table>

      <br>

      <p>
        Silakan membuka aplikasi MediIoT untuk melihat
        informasi lebih lengkap.
      </p>

      <hr>

      <p style="color: #777;">
        Email ini dikirim secara otomatis oleh sistem MediIoT.
      </p>
    `,
  };
}

module.exports = templateDaftarPemeriksaanBesok;
