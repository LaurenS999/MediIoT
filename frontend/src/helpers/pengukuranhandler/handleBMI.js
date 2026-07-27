import { createTimbangan_BMI } from "../../services/device/timbanganBMIService";

// ======================================================
// HANDLER BMI
// ======================================================
export const handleBMI = async ({
  id_pengukuran,
  dataAlat,
  bmiResult,
  tinggiBadan,
}) => {
  await createTimbangan_BMI({
    id_pengukuran,
    berat: dataAlat?.weight,
    tinggi_badan: tinggiBadan,
    bmi: bmiResult?.data?.bmi?.value,
    bmi_label: bmiResult?.data?.bmi?.label,
    body_fat: bmiResult?.data?.body_fat?.value,
    body_fat_label: bmiResult?.data?.body_fat?.label,
    muscle_mass: bmiResult?.data?.muscle_mass?.value,
    muscle_mass_label: bmiResult?.data?.muscle_mass?.label,
    water: bmiResult?.data?.water?.value,
    water_label: bmiResult?.data?.water?.label,
    visceral_fat: bmiResult?.data?.visceral_fat?.value,
    visceral_fat_label: bmiResult?.data?.visceral_fat?.label,
    bone: bmiResult?.data?.bone?.value,
    bone_label: bmiResult?.data?.bone?.label,
    metabolism: bmiResult?.data?.metabolism?.value,
    metabolism_label: bmiResult?.data?.metabolism?.label,
    protein: bmiResult?.data?.protein?.value,
    protein_label: bmiResult?.data?.protein?.label,
    body_age: bmiResult?.data?.body_age?.value,
    lbm: bmiResult?.data?.lbm?.value,
    payload_asli: {
      raw: dataAlat,
      bmi_result: bmiResult,
    },
    mac: dataAlat.mac_address,

    id_gateway: dataAlat.gateway_sn,
  });
};
