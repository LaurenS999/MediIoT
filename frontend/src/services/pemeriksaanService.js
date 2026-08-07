import apiLocal from "./apiLocal.js";

export const getpemeriksaan = () => {
  return apiLocal.get(`/pemeriksaan`);
};

export const createpemeriksaan = (data) => {
  return apiLocal.post("/pemeriksaan", data);
};

export const updatepemeriksaan = (id, data) => {
  return apiLocal.put(`/pemeriksaan/${id}`, data);
};

export const deletepemeriksaan = (id) => {
  return apiLocal.delete(`/pemeriksaan/${id}`);
};

export const getpemeriksaanpasien = (id_pasien) => {
  return apiLocal.get(`/pemeriksaan/${id_pasien}/pasien`);
};
