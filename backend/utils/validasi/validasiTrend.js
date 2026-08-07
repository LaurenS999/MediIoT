export const validasiTrend = async (db, id_pasien, id_kunjungan) => {
  // ==========================================
  // VALIDASI PARAMETER
  // ==========================================
  if (!id_pasien || !id_kunjungan) {
    return {
      valid: false,
      status: 400,
      message: "ID pasien dan ID kunjungan wajib diisi",
    };
  }

  // ==========================================
  // VALIDASI PASIEN
  // ==========================================
  const [pasien] = await db.query(
    `
      SELECT id_pasien
      FROM pasien
      WHERE id_pasien = ?
        AND status_delete = 0
      LIMIT 1
    `,
    [id_pasien],
  );

  if (pasien.length === 0) {
    return {
      valid: false,
      status: 404,
      message: "Pasien tidak ditemukan",
    };
  }

  // ==========================================
  // VALIDASI KUNJUNGAN
  // ==========================================
  const [kunjungan] = await db.query(
    `
      SELECT
        id_kunjungan,
        dibuat_pada
      FROM kunjungan
      WHERE id_kunjungan = ?
        AND id_pasien = ?
      LIMIT 1
    `,
    [id_kunjungan, id_pasien],
  );

  if (kunjungan.length === 0) {
    return {
      valid: false,
      status: 404,
      message: "Kunjungan tidak ditemukan untuk pasien tersebut",
    };
  }

  return {
    valid: true,
    kunjungan: kunjungan[0],
  };
};
