const cron = require("node-cron");
const db = require("../db");

const startPermintaanPemeriksaanCron = () => {
  console.log("[CRON] Pembatalan permintaan pemeriksaan setiap jam 17:00");
  cron.schedule(
    "0 17 * * *",
    async () => {
      try {
        const sql = `
          UPDATE permintaan_pemeriksaan
          SET status = 'dibatalkan'
          WHERE tanggal_pemeriksaan = CURDATE()
            AND status IN ('menunggu pemeriksaan')
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
};

module.exports = startPermintaanPemeriksaanCron;
