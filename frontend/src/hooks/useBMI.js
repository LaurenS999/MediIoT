import { useEffect, useState } from "react";

import { getBMI } from "../services/adminPanelServices";
import { hitungUmur } from "../utils/hitungUmur";

export default function useBMI({ devices, liveData, patient, tinggiBadan }) {
  const [bmiResult, setBmiResult] = useState(null);

  const normalizeKey = (key) => key?.toLowerCase()?.replace(/\s/g, "");

  const fetchBMI = async () => {
    try {
      const bmiDevice = devices.find((d) => d.device_function?.includes("bmi"));

      if (!bmiDevice) return;

      const dataKey = bmiDevice.mac_address;

      const dataAlat = liveData[dataKey];

      const berat = dataAlat?.weight;
      const impedance = dataAlat?.impedance;

      if (!berat || !tinggiBadan) {
        setBmiResult(null);
        return;
      }

      const umur = hitungUmur(patient?.tanggal_lahir);

      const result = await getBMI({
        height: tinggiBadan,
        age: umur,
        gender: patient?.jenis_kelamin === "L" ? "male" : "female",
        weight: berat,
        impedance,
      });

      setBmiResult(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBMI();
  }, [tinggiBadan, JSON.stringify(liveData), devices, patient]);

  return {
    bmiResult,
    setBmiResult,
  };
}
