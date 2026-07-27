const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  // database: "simrs",
  database: "simrs_produk",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;
