import apiLocal from "./apiLocal.js";

export const exportLaporanPasien = async (id, id_user) => {
  return await apiLocal.get(`/laporan/pasien/${id}/${id_user}`, {
    responseType: "blob",
  });
};

export const exportLaporanPengukuran = async (id_user) => {
  return await apiLocal.get(`/laporan/pengukuran/${id_user}`, {
    responseType: "blob",
  });
};
