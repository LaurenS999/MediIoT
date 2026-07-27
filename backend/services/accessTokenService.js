const db = require("../db.js");

const getAccessToken = async () => {
  console.log("LEWAT GET ACCESS TOKEN");
  const [rows] = await db.query(`
    SELECT
      client_id,
      client_key,
      server_key
    FROM access_token
    LIMIT 1
  `);

  if (rows.length === 0) {
    throw new Error("Data access token tidak ditemukan");
  }

  return rows[0];
};

module.exports = {
  getAccessToken,
};
