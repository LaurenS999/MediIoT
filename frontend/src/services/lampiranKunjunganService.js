import apiLocal from "./apiLocal";

export const uploadLampiran = (formData) =>
  apiLocal.post("/kunjungan-lampiran", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getLampiran = (idKunjungan) =>
  apiLocal.get(`/kunjungan-lampiran/${idKunjungan}`);

export const deleteLampiran = (id) =>
  apiLocal.delete(`/kunjungan-lampiran/${id}`);
