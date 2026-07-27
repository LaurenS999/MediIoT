async function generateKodePemeriksaan(conn) {
  // ==========================================
  // FORMAT TANGGAL
  // ==========================================
  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const tanggal = `${yyyy}${mm}${dd}`;

  // ==========================================
  // HITUNG DATA HARI INI
  // ==========================================
  const [countResult] = await conn.query(
    `
    SELECT COUNT(*) AS total
    FROM sesi_pemeriksaan
    WHERE DATE(dibuat_pada) = CURDATE()
    `,
  );

  const nomorUrut = String(countResult[0].total + 1).padStart(4, "0");

  return `PM-${tanggal}-${nomorUrut}`;
}

async function generateKodePengukuran(conn) {
  // ==========================================
  // FORMAT TANGGAL
  // ==========================================
  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const tanggal = `${yyyy}${mm}${dd}`;

  // ==========================================
  // HITUNG DATA HARI INI
  // ==========================================
  const [countResult] = await conn.query(
    `
    SELECT COUNT(*) AS total
    FROM sesi_pengukuran
    WHERE DATE(dibuat_pada) = CURDATE()
    `,
  );

  const nomorUrut = String(countResult[0].total + 1).padStart(4, "0");

  return `PG-${tanggal}-${nomorUrut}`;
}

async function generateKodeKunjungan(conn, id_pasien) {
  const [rows] = await conn.query(
    `
    SELECT kode_kunjungan
    FROM kunjungan
    WHERE id_pasien = ?
    ORDER BY id_kunjungan DESC
    LIMIT 1
    `,
    [id_pasien],
  );

  let nomorUrut = 1;

  if (rows.length > 0) {
    nomorUrut = parseInt(rows[0].kode_kunjungan.split("-").pop()) + 1;
  }

  const kodePasien = String(id_pasien).padStart(4, "0");
  return `K-` + kodePasien + `-${String(nomorUrut).padStart(4, "0")}`;
}

module.exports = {
  generateKodePemeriksaan,
  generateKodePengukuran,
  generateKodeKunjungan,
};
