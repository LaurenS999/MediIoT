export const pilihanJam = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
];

export const isJamLewat = (jadwal, tanggalPemeriksaan) => {
  // Belum memilih tanggal
  if (!tanggalPemeriksaan) {
    return false;
  }

  const sekarang = new Date();
  const tanggalDipilih = new Date(tanggalPemeriksaan);

  // Cek apakah tanggal yang dipilih adalah hari ini
  const isHariIni =
    tanggalDipilih.getFullYear() === sekarang.getFullYear() &&
    tanggalDipilih.getMonth() === sekarang.getMonth() &&
    tanggalDipilih.getDate() === sekarang.getDate();

  // Kalau bukan hari ini, semua jam bisa dipilih
  if (!isHariIni) {
    return false;
  }

  // Ambil jam mulai
  const jamSelesai = jadwal.split("-")[1];

  const [jam, menit] = jamSelesai.split(":").map(Number);

  const waktuSelesai = new Date();
  waktuSelesai.setHours(jam, menit, 0, 0);

  // 15 menit sebelum waktu selesai
  const batasPemesanan = new Date(waktuSelesai);
  batasPemesanan.setMinutes(batasPemesanan.getMinutes() - 10);

  // Slot hanya dianggap lewat jika waktu MULAI sudah lewat
  return sekarang >= batasPemesanan;
};
