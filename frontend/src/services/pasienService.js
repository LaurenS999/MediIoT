import apiLocal from "./apiLocal.js";

export const getPasien = (search, page, limit) => {
  return apiLocal.get(`pasien?search=${search}&page=${page}&limit=${limit}`);
};

export const getDetailPasien = (id_pasien) => {
  return apiLocal.get(`pasien/${id_pasien}`);
};

export const getPasienDrowdown = (id_relasi) => {
  return apiLocal.get(`pasien/dropdown?id_relasi=${id_relasi}`);
};

export const createPasien = (data) => {
  return apiLocal.post(`pasien`, data);
};

export const updatePasien = (id_pasien, data) => {
  return apiLocal.put(`pasien/${id_pasien}`, data);
};

export const deletePasien = (id_pasien) => {
  return apiLocal.delete(`pasien/${id_pasien}`);
};
