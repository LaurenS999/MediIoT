const cron = require("node-cron");
const db = require("../config/database");

const startPermintaanPemeriksaanCron = () => {
  cron.schedule(
    "40 16 * * *",
    // "0 17 * * *",
    async () => {
      try {
        const sql = `
          UPDATE permintaan_pemeriksaan
          SET status = 'dibatalkan'
          WHERE tanggal_pemeriksaan = CURDATE()
            AND status IN ('menunggu persetujuan', 'disetujui')
        `;

        const [result] = await db.query(sql);

        console.log(
          `[CRON] ${result.affectedRows} permintaan pemeriksaan dibatalkan otomatis.`,
        );
      } catch (error) {
        console.error(
          "[CRON] Gagal membatalkan permintaan pemeriksaan:",
          error,
        );
      }
    },
    {
      timezone: "Asia/Jakarta",
    },
  );

  console.log("Cron permintaan pemeriksaan berhasil dijalankan.");
};

module.exports = startPermintaanPemeriksaanCron;
