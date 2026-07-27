import apiLocal from "../apiLocal.js";

export const createTemperatur = (data) => {
  return apiLocal.post("pengukuran/temperatur", data);
};
