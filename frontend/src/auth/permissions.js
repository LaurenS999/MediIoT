export const permissions = {
  "super admin": [
    "device.read",
    "api.manage",

    "pasien.read",
    "pasien.create",
    "pasien.update",
    "pasien.delete",
    "pasien.detail.read",
    "pasien.riwayat-pengukuran.read",
    "pasien.pengukuran-terakhir.read",
    "pasien.detail-pengukuran.read",
    "pasien.graph.read",

    "permintaan.pemeriksaan.read",
    "permintaan.pemeriksaan.read.pasien",
    "permintaan.pemeriksaan.create",
    "permintaan.pemeriksaan.patch.tolak",
    "permintaan.pemeriksaan.patch.batal",
    "permintaan.pemeriksaan.patch.setuju",

    "pengukuran.read",
    "pengukuran.create",
    "pengukuran.update",
    "pengukuran.delete",
    "pengukuran.riwayat.read",

    "pemeriksaan_dokter.read",
    "pemeriksaan_dokter.update",
    "notifikasi_dokter.read",

    "trend.berat.read",
    "trend.tekanan-darah.read",
    "trend.fat.read",
    "trend.muscle.read",

    //CREATE PENGUKURAN DEVICE
    "pengukuran-bayi.create",
    "pengukuran-bmi.create",
    "pengukuran-ida.create",
    "pengukuran-oxy.create",
    "pengukuran-temperatur.create",
    "pengukuran-tensi.create",

    "laporan.export",
    "laporan.pasien.export",

    "kunjungan.read",
    "kunjungan.create",
    "kunjungan.update",

    "pemeriksaan.read",
    "pemeriksaan.create",
    "pemeriksaan.update",

    "notifikasi_perawat.read",
  ],

  pasien: [
    "pasien.detail.read",
    "pasien.riwayat-pengukuran.read",
    "pasien.pengukuran-terakhir.read",
    "pasien.detail-pengukuran.read",
    "pasien.graph.read",
    "laporan.pasien.export",

    "trend.berat.read",
    "trend.tekanan-darah.read",
    "trend.fat.read",
    "trend.muscle.read",

    "permintaan.pemeriksaan.create",
    "permintaan.pemeriksaan.read",
    "permintaan.pemeriksaan.read.pasien",
    "permintaan.pemeriksaan.patch.batal",

    "kunjungan.read",

    "notifikasi_perawat.read",
  ],

  perawat: [
    "pasien.read",
    "pasien.create",
    "pasien.update",
    "pasien.delete",
    "pasien.detail.read",
    "pasien.riwayat-pengukuran.read",
    "pasien.pengukuran-terakhir.read",
    "pasien.detail-pengukuran.read",
    "pasien.graph.read",

    "permintaan.pemeriksaan.read",
    "permintaan.pemeriksaan.read.pasien",
    "permintaan.pemeriksaan.patch.tolak",
    "permintaan.pemeriksaan.patch.batal",
    "permintaan.pemeriksaan.patch.setuju",

    "pengukuran.read",
    "pengukuran.create",
    "pengukuran.update",
    "pengukuran.delete",
    "pengukuran.riwayat.read",

    "trend.berat.read",
    "trend.tekanan-darah.read",
    "trend.fat.read",
    "trend.muscle.read",

    //CREATE PENGUKURAN DEVICE
    "pengukuran-bayi.create",
    "pengukuran-bmi.create",
    "pengukuran-ida.create",
    "pengukuran-oxy.create",
    "pengukuran-temperatur.create",
    "pengukuran-tensi.create",

    "laporan.export",
    "laporan.pasien.export",

    "kunjungan.read",
    "kunjungan.create",

    "pemeriksaan.read",
    "pemeriksaan.create",
    "pemeriksaan.update",
  ],

  admin: ["device.read", "api.manage", "pasien.read", "pengukuran.read"],

  dokter: [
    "pasien.read",
    "pasien.detail.read",
    "pasien.riwayat-pengukuran.read",
    "pasien.pengukuran-terakhir.read",
    "pasien.detail-pengukuran.read",
    "pasien.graph.read",

    "pengukuran.riwayat.read",

    "pemeriksaan_dokter.read",
    "pemeriksaan_dokter.update",
    "notifikasi_dokter.read",

    "trend.berat.read",
    "trend.tekanan-darah.read",
    "trend.fat.read",
    "trend.muscle.read",

    "laporan.export",
    "laporan.pasien.export",

    "kunjungan.read",
    "kunjungan.update",
  ],
};
