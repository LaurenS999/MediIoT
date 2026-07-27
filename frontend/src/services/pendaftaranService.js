import apiLocal from "./apiLocal.js";

export const getPendaftaran = () => {
  const response = apiLocal.get(`/pendaftaran`);
  return response;
};

export const getPendaftaranCheckIn = () => {
  const response = apiLocal.get(`/pendaftaran/checkin`);
  return response;
};

export const getPendaftaranDetail = (id_pendaftaran) => {
  const response = apiLocal.get(`/pendaftaran/${id_pendaftaran}`);
  return response;
};

export const getPendaftaranPasien = (id_pasien) => {
  const response = apiLocal.get(`/pendaftaran/${id_pasien}/pasien`);
  return response;
};

export const postPendaftaran = (data) => {
  const response = apiLocal.post(`/pendaftaran`, data);
  return response;
};

export const patchPendaftaranSetuju = (kode_pendaftaran) => {
  const response = apiLocal.patch(`/pendaftaran/${kode_pendaftaran}/disetujui`);
  return response;
};

export const patchPendaftaranTolak = (kode_pendaftaran, data) => {
  const response = apiLocal.patch(`/pendaftaran/${kode_pendaftaran}/ditolak`, {
    data,
  });
  return response;
};

export const patchPendaftaranBatal = (kode_pendaftaran, data) => {
  const response = apiLocal.patch(
    `/pendaftaran/${kode_pendaftaran}/dibatalkan`,
    {
      data,
    },
  );
  return response;
};

export const patchPendaftaranCheckin = (kode_pendaftaran) => {
  const response = apiLocal.patch(`/pendaftaran/${kode_pendaftaran}/check-in`);
  return response;
};

export const patchPendaftaranSelesai = (kode_pendaftaran) => {
  const response = apiLocal.patch(`/pendaftaran/${kode_pendaftaran}/selesai`);
  return response;
};
