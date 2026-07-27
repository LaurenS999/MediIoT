import apiLocal from "../apiLocal.js";

export const createOxy = (data) => {
  return apiLocal.post(`pengukuran/oxy`, data);
};
