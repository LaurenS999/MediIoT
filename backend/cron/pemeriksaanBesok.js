const cron = require("node-cron");

const db = require("../db");
const sendEmail = require("../helpers/kirimEmail");

const templateDaftarPemeriksaanBesok = require("../emails/templates/daftarPemeriksaanBesok");

const startCronPemeriksaanBesok = () => {
  cron.schedule(
    "0 16 * * *",
    async () => {
      console.log("CRON: Mengecek pemeriksaan untuk besok...");

      try {
        const [rows] = await db.query(`
          SELECT
            pp.kode_permintaan_pemeriksaan,
            pp.tanggal_pemeriksaan,
            pp.jam_pemeriksaan,
            pp.keluhan,
            p.nama
          FROM permintaan_pemeriksaan pp
          INNER JOIN pasien p
            ON pp.id_pasien = p.id_pasien
          WHERE pp.tanggal_pemeriksaan = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
            AND pp.status = 'menunggu pemeriksaan'
          ORDER BY p.nama ASC
        `);

        // Tidak ada pasien yang akan diperiksa besok
        if (rows.length === 0) {
          console.log("CRON: Tidak ada permintaan pemeriksaan untuk besok.");

          return;
        }

        const daftarPermintaan = rows.map((item) => ({
          kodePermintaan: item.kode_permintaan_pemeriksaan,
          namaPasien: item.nama,
          tanggalPemeriksaan: item.tanggal_pemeriksaan,
          jamPemeriksaan: item.jam_pemeriksaan,
          keluhan: item.keluhan,
        }));

        const email = templateDaftarPemeriksaanBesok(daftarPermintaan);

        await sendEmail({
          to: "laurensunyoto@gmail.com",
          subject: email.subject,
          html: email.html,
        });

        console.log(
          `CRON: Email berhasil dikirim. Total pasien: ${rows.length}`,
        );
      } catch (error) {
        console.error(
          "CRON ERROR: Gagal mengirim daftar pemeriksaan besok:",
          error,
        );
      }
    },
    {
      timezone: "Asia/Jakarta",
      noOverlap: true,
    },
  );

  console.log("CRON: Pemeriksaan besok aktif. Jadwal setiap hari pukul 16:00.");
};

module.exports = startCronPemeriksaanBesok;
