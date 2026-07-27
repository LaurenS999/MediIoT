import apiLocal from "../apiLocal.js";

export const createTimbangan_Bayi = (data) => {
  return apiLocal.post("pengukuran/timbangan_bayi", data);
};
