const cron = require("node-cron");
const { deleteExpiredStatusAlat } = require("../services/statusAlatService");

function startCleanupStatusAlatCron() {
  cron.schedule("* * * * *", async () => {
    try {
      const deletedRows = await deleteExpiredStatusAlat();
      console.log("[CRON] 1 Menit Pengecekan");

      if (deletedRows > 0) {
        console.log(
          `[CRON] Berhasil menghapus ${deletedRows} data status_alat yang sudah kedaluwarsa`,
        );
      }
    } catch (error) {
      console.error("[CRON] Gagal menghapus status_alat:", error);
    }
  });

  console.log("[CRON] Cleanup Status Alat berjalan setiap 1 menit");
}

module.exports = {
  startCleanupStatusAlatCron,
};
