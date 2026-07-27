import apiLocal from "../apiLocal.js";

export const createTimbangan_BMI = (data) => {
  return apiLocal.post("pengukuran/timbangan_bmi", data);
};
