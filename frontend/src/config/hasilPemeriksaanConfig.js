export const hasilPemeriksaanConfig = {
  vital: {
    title: "Vital Sign",
    items: [
      {
        key: "systolic",
        label: "Sistol",
        unit: "mmHg",
      },
      {
        key: "diastolic",
        label: "Diastol",
        unit: "mmHg",
      },
      {
        key: "map",
        label: "MAP",
        unit: "mmHg",
      },
      {
        key: "pulse",
        label: "Nadi",
        unit: "bpm",
      },
      {
        key: "spo2",
        label: "SpO₂",
        unit: "%",
      },
      {
        key: "suhu",
        label: "Suhu",
        unit: "°C",
      },
    ],
  },

  body: {
    title: "Antropometri",
    items: [
      {
        key: "berat",
        label: "Berat Badan",
        unit: "kg",
      },
      {
        key: "tinggi",
        label: "Tinggi Badan",
        unit: "cm",
      },
    ],
  },

  composition: {
    title: "Komposisi Tubuh",
    items: [
      {
        key: "bmi",
        label: "BMI",
      },
      {
        key: "bodyFat",
        label: "Body Fat",
        unit: "%",
        statusKey: "bodyFat_label",
      },
      {
        key: "muscleMass",
        label: "Muscle Mass",
        unit: "kg",
        statusKey: "muscleMass_label",
      },
      {
        key: "water",
        label: "Water",
        unit: "%",
        statusKey: "water_label",
      },
      {
        key: "visceralFat",
        label: "Visceral Fat",
        statusKey: "visceralFat_label",
      },
      {
        key: "bone",
        label: "Bone",
        unit: "kg",
        statusKey: "bone_label",
      },
      {
        key: "metabolism",
        label: "Metabolism",
        unit: "kcal",
        statusKey: "metabolism_label",
      },
      {
        key: "protein",
        label: "Protein",
        unit: "%",
        statusKey: "protein_label",
      },
      {
        key: "lbm",
        label: "LBM",
      },
      {
        key: "bodyAge",
        label: "Body Age",
        unit: "Tahun",
      },
    ],
  },
};
