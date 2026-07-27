export const pengukuranSocketMap = {
  // =====================================
  // TENSIONE
  // =====================================
  tensione: {
    event: "listen_tensione",
    dataKey: "data_tensione",
    device_function: "tensione",
    macType: "single",
    payload_wajib: [
      "device_function",
      "mac",
      "systolic",
      "diastolic",
      "map",
      "pulse_rate",
      "spo2",
      "user_type",
      "error_status",
    ],

    summaryFields: [
      {
        key: "systolic",
        label: "Tekanan Sistol",
        suffix: " mmHg",
      },
      {
        key: "diastolic",
        label: "Tekanan Diastol",
        suffix: " mmHg",
      },
      {
        key: "map",
        label: "MAP",
        suffix: " mmHg",
      },
      {
        key: "pulse_rate",
        label: "Denyut Nadi",
        suffix: " bpm",
      },
      {
        key: "spo2",
        label: "SpO₂",
        suffix: " %",
      },
    ],
  },

  // =====================================
  // FOX 1
  // =====================================
  pulse_oximeter: {
    event: "listen_pulse_oximeter_fox_1",
    dataKey: "data_pulse_oximeter_fox_1",
    device_function: "pulse_oximeter",
    macType: "single",
    payload_wajib: ["device_function", "mac", "pulse_rate", "spo2"],
    summaryFields: [
      {
        key: "spo2",
        label: "SpO₂",
        suffix: " %",
      },
      {
        key: "pulse_rate",
        label: "Denyut Nadi",
        suffix: " bpm",
      },
    ],
  },

  // =====================================
  // MFT01
  // =====================================
  mft01: {
    event: "listen_mft01",
    dataKey: "data_mft01",
    device_function: "mft01",
    macType: "single",
    payload_wajib: ["device_function", "mac", "temperature"],
    summaryFields: [
      {
        key: "temperature",
        label: "Suhu Tubuh",
        suffix: " °C",
      },
    ],
  },

  // =====================================
  // DIGIT PRO BMI
  // =====================================
  digitpro_bmi: {
    event: "listen_bmi",
    dataKey: "data_bmi",
    device_function: "digitpro_bmi",
    macType: "array",
    payload_wajib: ["device_function", "mac", "weight", "impedance"],
    summaryFields: [
      {
        key: "weight",
        label: "Berat Badan",
        suffix: " kg",
      },
      {
        key: "impedance",
        label: "Impedansi",
        suffix: " Ω",
      },
      {
        label: "BMI",
        source: "bmiResult",
        suffix: "Kg/M2",
        valuePath: "data.bmi.value",
        labelPath: "data.bmi.label",
      },

      {
        label: "Body Fat",
        source: "bmiResult",
        suffix: " %",
        valuePath: "data.body_fat.value",
        labelPath: "data.body_fat.label",
      },

      {
        label: "Muscle",
        source: "bmiResult",
        suffix: " %",
        valuePath: "data.muscle_mass.value",
        labelPath: "data.muscle_mass.label",
      },
      {
        label: "Water",
        source: "bmiResult",
        suffix: " %",
        valuePath: "data.water.value",
        labelPath: "data.water.label",
      },

      {
        label: "Visceral Fat",
        source: "bmiResult",
        valuePath: "data.visceral_fat.value",
        labelPath: "data.visceral_fat.label",
      },

      {
        label: "Bone",
        source: "bmiResult",
        valuePath: "data.bone.value",
        labelPath: "data.bone.label",
      },

      {
        label: "Metabolism",
        source: "bmiResult",
        suffix: " Kkal",
        valuePath: "data.metabolism.value",
        labelPath: "data.metabolism.label",
      },

      {
        label: "Protein",
        source: "bmiResult",
        valuePath: "data.protein.value",
        labelPath: "data.protein.label",
      },

      {
        label: "Body Age",
        source: "bmiResult",
        valuePath: "data.body_age.value",
        labelPath: "data.body_age.label",
      },
      {
        label: "LBM",
        source: "bmiResult",
        suffix: " Kg",
        valuePath: "data.lbm.value",
        labelPath: "data.lbm.label",
      },
    ],
  },

  // =====================================
  // DIGIT PRO BABY
  // =====================================
  digitpro_baby: {
    event: "listen_digitprobaby_result",
    dataKey: "data_digitprobaby",
    device_function: "digitpro_baby",
    macType: "array",
    payload_wajib: ["device_function", "mac", "weight"],
    summaryFields: [
      {
        key: "weight",
        label: "Berat Bayi",
        suffix: " Kg",
      },
    ],
  },

  // =====================================
  // DIGIT PRO IDA
  // =====================================
  digitpro_ida: {
    event: "listen_digitproida_result",
    dataKey: "data_digitproida",
    device_function: "digitpro_ida",
    macType: "array",
    payload_wajib: ["device_function", "mac", "weight_baby", "weight_mother"],
    summaryFields: [
      {
        key: "weight_baby",
        label: "Berat Anak",
        suffix: " Kg",
      },
      {
        key: "weight_mother",
        label: "Berat Ibu",
        suffix: " Kg",
      },
    ],
  },

  // =====================================
  // DS 001
  // =====================================
  diagnostic_station_001: {
    event: "listen_ds001",
    dataKey: "data_ds001",
    device_function: "diagnostic_station_001",
    macType: "array",
  },
};
