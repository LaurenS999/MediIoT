import apiLocal from "./apiLocal.js";

export const getPemeriksaanDokter = (search, page, limit) => {
  return apiLocal.get(
    `/pemeriksaan-dokter/tunggu-dokter?search=${search}&page=${page}&limit=${limit}`,
  );
};

export const getDetailPemeriksaanDokter = (id_kunjungan) => {
  return apiLocal.get(`/pemeriksaan-dokter/${id_kunjungan}`);
};

export const updatePemeriksaanDokter = (kode_sesi, data) => {
  return apiLocal.put(
    `pemeriksaan-dokter/${kode_sesi}/pemeriksaan-dokter`,
    data,
  );
};
