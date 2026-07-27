import apiLocal from "../apiLocal.js";

export const createTimbangan_IDA = (data) => {
  return apiLocal.post("pengukuran/timbangan_ida", data);
};
