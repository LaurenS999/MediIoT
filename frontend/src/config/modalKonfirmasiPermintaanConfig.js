export const modalKonfirmasiPermintaanConfig = {
  tolak: {
    title: "Konfirmasi Penolakan",
    message: "Masukkan alasan penolakan pendaftaran.",
    confirmText: "Tolak",
    confirmClass: "btn-danger",
    showWaktuPemeriksaan: false,
    showAlasan: true,
  },

  batal: {
    title: "Konfirmasi Pembatalan",
    message: "Masukkan alasan pembatalan pendaftaran.",
    confirmText: "Batalkan",
    confirmClass: "btn-secondary",
    showWaktuPemeriksaan: false,
    showAlasan: true,
  },

  selesai: {
    title: "Konfirmasi Penyelesaian",
    message:
      "Apakah anda sudah melakukan pemeriksaan terhadap pasien ? \nApakah anda yakin menyelesaikan permintaan pemeriksaan ?.",
    confirmText: "Ya",
    confirmClass: "btn-primary",
    showAlasan: false,
    showWaktuPemeriksaan: true,
  },
};
