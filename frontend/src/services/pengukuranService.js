import apiLocal from "./apiLocal.js";

export const getPengukuran = () => {
  return apiLocal.get(`pengukuran`);
};

export const createPengukuran = () => {
  return apiLocal.post("pengukuran");
};

export const updatePengukuran = (id, data) => {
  return apiLocal.put(`pengukuran/${id}`, data);
};

export const deletePengukuran = (id) => {
  return apiLocal.delete(`pengukuran/${id}`);
};

export const getRiwayatPengukuran = (page, limit, search) => {
  return apiLocal.get(
    `pengukuran/riwayat?page=${page}&limit=${limit}&search=${search}`,
  );
};
