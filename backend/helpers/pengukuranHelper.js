const db = require("../db");

const buildMeasurementData = async (id_sesi) => {
  // =====================================================
  // GET SESI
  // =====================================================
  const [sesiRows] = await db.query(
    `
    SELECT
      id_pengukuran,
      dibuat_pada AS tanggal
    FROM sesi_pengukuran
    WHERE id_pengukuran = ?
    LIMIT 1
    `,
    [id_sesi],
  );

  if (sesiRows.length === 0) {
    return null;
  }

  const sesi = sesiRows[0];

  const tanggal = sesi.tanggal;

  // =====================================================
  // GET TENSI
  // =====================================================
  const [tensiRows] = await db.query(
    `
    SELECT *
    FROM pengukuran_tensi
    WHERE id_sesi = ?
    LIMIT 1
    `,
    [id_sesi],
  );

  const tensi = tensiRows[0] || null;

  // =====================================================
  // GET SUHU
  // =====================================================
  const [suhuRows] = await db.query(
    `
    SELECT *
    FROM pengukuran_suhu
    WHERE id_sesi = ?
    LIMIT 1
    `,
    [id_sesi],
  );

  const suhu = suhuRows[0] || null;

  // =====================================================
  // GET OXY
  // =====================================================
  const [oxyRows] = await db.query(
    `
    SELECT *
    FROM pengukuran_oxy
    WHERE id_sesi = ?
    LIMIT 1
    `,
    [id_sesi],
  );

  const oxy = oxyRows[0] || null;

  // =====================================================
  // GET BMI
  // =====================================================
  const [bmiRows] = await db.query(
    `
    SELECT *
    FROM pengukuran_bmi
    WHERE id_sesi = ?
    LIMIT 1
    `,
    [id_sesi],
  );

  const bmi = bmiRows[0] || null;

  // =====================================================
  // GET Bayi
  // =====================================================
  const [bayiRows] = await db.query(
    `
    SELECT *
    FROM pengukuran_berat_bayi
    WHERE id_sesi = ?
    LIMIT 1
    `,
    [id_sesi],
  );

  const bayi = bayiRows[0] || null;

  // =====================================================
  // GET IDA
  // =====================================================
  const [idaRows] = await db.query(
    `
    SELECT *
    FROM pengukuran_ida
    WHERE id_sesi = ?
    LIMIT 1
    `,
    [id_sesi],
  );

  const ida = idaRows[0] || null;

  // =====================================================
  // RESPONSE
  // =====================================================
  return {
    id_sesi,

    tanggal,

    vital: {
      systolic: tensi?.systolic ?? null,

      diastolic: tensi?.diastolic ?? null,

      map: tensi?.map ?? null,

      pulse: tensi?.denyut_nadi ?? oxy?.denyut_nadi ?? null,

      spo2: tensi?.spo2 ?? oxy?.spo2 ?? null,

      suhu: suhu?.suhu ?? null,
    },

    body: {
      berat: bmi?.berat ?? null,
      berat_bayi: ida?.berat_bayi ?? bayi?.berat ?? null,

      tinggi: bmi?.tinggi_badan ?? null,
    },

    composition: {
      bmi: bmi?.bmi ?? null,

      bmi_label: bmi?.bmi_label ?? null,

      lbm: bmi?.lbm ?? null,

      bodyFat: bmi?.body_fat ?? null,

      bodyFat_label: bmi?.body_fat_label ?? null,

      muscleMass: bmi?.muscle_mass ?? null,

      muscleMass_label: bmi?.muscle_mass_label ?? null,

      water: bmi?.water ?? null,

      water_label: bmi?.water_label ?? null,

      visceralFat: bmi?.visceral_fat ?? null,

      visceralFat_label: bmi?.visceral_fat_label ?? null,

      bone: bmi?.bone ?? null,

      bone_label: bmi?.bone_label ?? null,

      metabolism: bmi?.metabolism ?? null,

      metabolism_label: bmi?.metabolism_label ?? null,

      protein: bmi?.protein ?? null,

      protein_label: bmi?.protein_label ?? null,

      bodyAge: bmi?.body_age ?? null,
    },
  };
};

module.exports = {
  buildMeasurementData,
};
