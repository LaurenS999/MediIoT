export const renderAktivitasKunjungan = (item) => {
  const aktivitas = [];

  if (item.id_pemeriksaan) {
    aktivitas.push("Pemeriksaan");
  }

  if (item.id_pengukuran) {
    aktivitas.push("Pengukuran");
  }

  if (item.id_dokter) {
    aktivitas.push("Pemeriksaan Dokter");
  }

  return aktivitas.join(", ");
};
