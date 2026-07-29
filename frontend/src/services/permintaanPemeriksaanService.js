import apiLocal from "./apiLocal.js";

export const getPendaftaran = () => {
  const response = apiLocal.get(`/permintaan-pemeriksaan`);
  return response;
};

export const getPendaftaranPasien = (id_pasien) => {
  const response = apiLocal.get(`/permintaan-pemeriksaan/${id_pasien}/pasien`);
  return response;
};

export const postPendaftaran = (data) => {
  console.log("DATA : ", data);
  const response = apiLocal.post(`/permintaan-pemeriksaan`, data);
  return response;
};

export const patchPendaftaranSetuju = (id_permintaan_pemeriksaan) => {
  const response = apiLocal.patch(
    `/permintaan-pemeriksaan/${id_permintaan_pemeriksaan}/disetujui`,
  );
  return response;
};

export const patchPendaftaranTolak = (id_permintaan_pemeriksaan, data) => {
  const response = apiLocal.patch(
    `/permintaan-pemeriksaan/${id_permintaan_pemeriksaan}/ditolak`,
    {
      data,
    },
  );
  return response;
};

export const patchPendaftaranBatal = (id_permintaan_pemeriksaan, data) => {
  const response = apiLocal.patch(
    `/permintaan-pemeriksaan/${id_permintaan_pemeriksaan}/dibatalkan`,
    {
      data,
    },
  );
  return response;
};
