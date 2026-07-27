// utils/auditLog.js

const db = require("../db");

const createAuditLog = async ({ id_user, action }) => {
  try {
    await db.query(
      `
      INSERT INTO audit_logs (id_user, action)
      VALUES (?, ?)
      `,
      [id_user, action],
    );
  } catch (err) {
    console.error("Audit Log Error:", err.message);
  }
};

module.exports = createAuditLog;
