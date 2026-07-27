import apiLocal from "./apiLocal.js";

export const getNotifikasiDokter = async () => {
  const response = apiLocal.get("/notifikasi/dokter");
  return response;
};

export const getNotifikasiPerawat = async () => {
  const response = apiLocal.get("/notifikasi/perawat");
  return response;
};
