import apiLocal from "../apiLocal.js";

export const createTensi = (data) => {
  return apiLocal.post("pengukuran/tensi", data);
};
