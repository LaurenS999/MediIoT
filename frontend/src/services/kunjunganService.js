import apiLocal from "./apiLocal.js";

export const getKunjungan = async (search, page, limit) => {
  const response = await apiLocal.get(
    `/kunjungan?search=${search}&page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const getKunjunganPasien = async (id_pasien, page, limit) => {
  const response = await apiLocal.get(
    `/kunjungan/${id_pasien}?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const getKunjunganDetail_Terakhir = async (id_pasien) => {
  const response = await apiLocal.get(
    `/kunjungan/${id_pasien}/kunjungan-terakhir`,
  );
  return response.data;
};

export const createKunjungan = async (form) => {
  const response = await apiLocal.post("/kunjungan", form);
  return response.data;
};

export const getKunjunganSelectedRiwayat = async (
  id_pasien,
  id_pemeriksaan,
  id_pengukuran,
) => {
  const response = await apiLocal.get(
    `/kunjungan/${id_pasien}/riwayat-kunjungan`,
    {
      params: {
        id_pemeriksaan,
        id_pengukuran,
      },
    },
  );
  return response.data;
};
