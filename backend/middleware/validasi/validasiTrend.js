const db = require("../../db.js");

const validasiKunjunganTrend = async (req, res, next) => {
  try {
    const { id_pasien, id_kunjungan } = req.params;

    // ==========================================
    // VALIDASI PARAMETER
    // ==========================================

    if (!id_pasien || !id_kunjungan) {
      return res.status(400).json({
        success: false,
        message: "ID pasien dan ID kunjungan wajib diisi",
      });
    }

    // ==========================================
    // CEK KUNJUNGAN
    // ==========================================

    const [kunjungan] = await db.query(
      `
        SELECT
          id_kunjungan,
          id_pasien,
          dibuat_pada
        FROM kunjungan
        WHERE id_kunjungan = ?
        LIMIT 1
      `,
      [id_kunjungan],
    );

    if (kunjungan.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kunjungan tidak ditemukan",
      });
    }

    // ==========================================
    // CEK KUNJUNGAN MILIK PASIEN
    // ==========================================

    if (String(kunjungan[0].id_pasien) !== String(id_pasien)) {
      return res.status(403).json({
        success: false,
        message: "Kunjungan bukan milik pasien tersebut",
      });
    }

    // ==========================================
    // SIMPAN DATA KUNJUNGAN
    // AGAR BISA DIGUNAKAN ENDPOINT
    // ==========================================

    req.kunjunganTrend = kunjungan[0];

    next();
  } catch (error) {
    console.error("VALIDASI KUNJUNGAN TREND ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal melakukan validasi kunjungan",
    });
  }
};

module.exports = validasiKunjunganTrend;
