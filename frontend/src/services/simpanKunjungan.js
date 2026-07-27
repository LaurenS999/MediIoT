import apiLocal from "./apiLocal.js";

export const createSimpanKunjungan = (formData) => {
  return apiLocal.post("/simpan-kunjungan", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
