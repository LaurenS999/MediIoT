import apiLocal from "./apiLocal.js";

export const getPermintaan = (page, limit) => {
  console.log("PAGE ", page);
  console.log("PAGE ", limit);
  const response = apiLocal.get(
    `/permintaan-pemeriksaan?page=${page}&limit=${limit}`,
  );
  return response;
};

export const getPermintaanPasien = (id_pasien, page, limit) => {
  const response = apiLocal.get(
    `/permintaan-pemeriksaan/${id_pasien}/pasien?page=${page}&limit=${limit}`,
  );
  return response;
};

export const postPermintaan = (data) => {
  console.log("DATA : ", data);
  const response = apiLocal.post(`/permintaan-pemeriksaan`, data);
  return response;
};

export const patchPermintaanSelesai = (
  formSelesai,
  id_permintaan_pemeriksaan,
) => {
  const response = apiLocal.patch(
    `/permintaan-pemeriksaan/${id_permintaan_pemeriksaan}/selesai`,
    formSelesai,
  );
  return response;
};

export const patchPermintaanBatal = (id_permintaan_pemeriksaan, data) => {
  const response = apiLocal.patch(
    `/permintaan-pemeriksaan/${id_permintaan_pemeriksaan}/dibatalkan`,
    {
      data,
    },
  );
  return response;
};
