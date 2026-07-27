const db = require("../db");

async function deleteExpiredStatusAlat() {
  const [result] = await db.query(`
    DELETE FROM status_alat
    WHERE terakhir_aktif_pada < DATE_SUB(NOW(), INTERVAL 1 MINUTE)
  `);

  return result.affectedRows;
}

module.exports = {
  deleteExpiredStatusAlat,
};
