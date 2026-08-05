const pageConfig = [
  {
    match: (path) => path === "/",
    title: "Dashboard",
    subtitle: "",
  },
  {
    match: (path) => path === "/pasien",
    title: "Daftar Pasien",
    subtitle: "Kelola data pasien rumah sakit",
  },
  {
    match: (path) => path.startsWith("/pasien/"),
    title: "Detail Pasien",
    subtitle: "Informasi detail pasien dan trend pengukuran",
  },
  {
    match: (path) => path === "/pemeriksaan-dokter",
    title: "Antrian Pemeriksaan Dokter",
    subtitle: "Kelola data pasien yang belum diperiksa dokter",
  },

  {
    match: (path) => path === "/pemeriksaan-dokter/",
    title: "Pemeriksaan Dokter",
    subtitle: "Lengkapi hasil pemeriksaan dokter pasien",
  },

  {
    match: (path) => path.startsWith("/pemeriksaan-awal"),
    title: "Pemeriksaan Awal",
    subtitle: "",
  },
  {
    match: (path) => path.startsWith("/setup-kunjungan"),
    title: "Setup Pemeriksaan Awal",
    subtitle: "Pilih pasien, jenis pengukuran, dan device.",
  },
  {
    match: (path) => path.startsWith("/riwayat-kunjungan"),
    title: "Riwayat Kunjungan",
    subtitle: "Monitoring hasil pengukuran pasien",
  },
  {
    match: (path) => path === "/permintaan-pemeriksaan",
    title: "Permintaan Pemeriksaan",
    subtitle:
      "Daftar permintaan pemeriksaan dan lihat riwayat permintaan pemeriksaan.",
  },
  {
    match: (path) => path === "/user",
    title: "Manajemen User",
    subtitle: "Kelola akun pengguna sistem",
  },
  {
    match: (path) => path === "/alat-kesehatan",
    title: "Pemantauan Device",
    subtitle: "Monitoring device rumah sakit",
  },

  {
    match: (path) => path === "/Access-Code",
    title: "MedLink Access Code",
    subtitle: "Kelola Konfigurasi API MedLink",
  },

  {
    match: (path) => path === "/profile",
    title: "Kelola akun dan password",
    subtitle: "",
  },
];

export const getPageTitle = (pathname) => {
  const page = pageConfig.find((item) => item.match(pathname));

  return page?.title || "MediIoT";
};
