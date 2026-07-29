require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

//Connect ke Frontend
app.use(
  cors({
    origin: [
      process.env.REACT_APP_APP_ORIGIN,
      process.env.REACT_APP_APP_ORIGIN,
      "http://localhost:3000",
      "/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

//Middleware
app.use(express.json());

//Create Route to CRUD
const pasienRoutes = require("./routes/pasien");
app.use("/pasien", pasienRoutes);

const pengukuranRoutes = require("./routes/pengukuran");
app.use("/pengukuran", pengukuranRoutes);

const pemeriksaanRoutes = require("./routes/pemeriksaan");
app.use("/pemeriksaan", pemeriksaanRoutes);

const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

const profileRoutes = require("./routes/profile");
app.use("/profile", profileRoutes);

const TrendRoutes = require("./routes/trend");
app.use("/trend", TrendRoutes);

const LaporanRoutes = require("./routes/laporan");
app.use("/laporan", LaporanRoutes);

const statusAlatRoutes = require("./routes/status_alat");
app.use("/status-alat", statusAlatRoutes);

const AccessTokenRoutes = require("./routes/access_token");
app.use("/access_token", AccessTokenRoutes);

const AuditLogRoutes = require("./routes/audit_log");
app.use("/audit-log", AuditLogRoutes);

const elitechMedlinkWebhook = require("./routes/integration/elitech_medlink");
app.use("/api/integration/elitech-medlink", elitechMedlinkWebhook);

const pemeriksaanDokterRoutes = require("./routes/pemeriksaan_dokter");
app.use("/pemeriksaan-dokter", pemeriksaanDokterRoutes);

const notifikasiRoutes = require("./routes/notifikasi");
app.use("/notifikasi", notifikasiRoutes);

const peranRoutes = require("./routes/peran");
app.use("/peran", peranRoutes);

const permintaanPemeriksaanRoutes = require("./routes/permintaan_pemeriksaan");
app.use("/permintaan-pemeriksaan", permintaanPemeriksaanRoutes);

const kunjunganRoutes = require("./routes/kunjungan");
app.use("/kunjungan", kunjunganRoutes);

const simpanKunjunganRoutes = require("./routes/simpan_kunjungan");
app.use("/simpan-kunjungan", simpanKunjunganRoutes);

//API MEDLINK
const medlinkRoutes = require("./routes/medlink");
app.use("/medlink", medlinkRoutes);

// UNTUK ROUTE DEVICE
const timbanganBayiRoutes = require("./routes/device/pengukuran_bayi");
app.use("/pengukuran/timbangan_bayi", timbanganBayiRoutes);
const timbanganBMI = require("./routes/device/pengukuran_bmi");
app.use("/pengukuran/timbangan_bmi", timbanganBMI);
const timbanganIDA = require("./routes/device/pengukuran_ida");
app.use("/pengukuran/timbangan_ida", timbanganIDA);
const oxymeter = require("./routes/device/pengukuran_oxy");
app.use("/pengukuran/oxy", oxymeter);
const temperatur = require("./routes/device/pengukuran_temperatur");
app.use("/pengukuran/temperatur", temperatur);
const tensi = require("./routes/device/pengukuran_tensi");
app.use("/pengukuran/tensi", tensi);

// LOGGING SEMUA PAYLOAD YANG DITERIMA
// const startMedlinkLogger = require("./services/payloadLogger");
// startMedlinkLogger();

// CRON JOB UNTUK MENGHAPUS SEMUA ALAT YANG TIDAK DIGUNAKAN
const { startCleanupStatusAlatCron } = require("./cron/cleanupStatusAlat");
startCleanupStatusAlatCron();

const startCronPemeriksaanBesok = require("./cron/pemeriksaanBesok");
startCronPemeriksaanBesok();

// BUAT LAMPIRAN
app.use("/uploads", express.static("uploads"));

const lampiranKunjunganRouter = require("./routes/kunjungan_lampiran");
app.use("/kunjungan-lampiran", lampiranKunjunganRouter);

//Menjalankan server di Node.js
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server berjalan di port ${PORT}`);
});
