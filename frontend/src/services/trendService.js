import apiLocal from "./apiLocal.js";

export const getTrendBerat = (id_pasien, id_kunjungan) => {
  const response = apiLocal.get(
    `/trend/${id_pasien}/${id_kunjungan}/berat-badan`,
  );
  return response;
};

export const getTrendFat = (id_pasien, id_kunjungan) => {
  const response = apiLocal.get(`/trend/${id_pasien}/${id_kunjungan}/body-fat`);
  return response;
};

export const getTrendMuscle = (id_pasien, id_kunjungan) => {
  const response = apiLocal.get(
    `/trend/${id_pasien}/${id_kunjungan}/muscle-mass`,
  );
  return response;
};

export const getTrendTensi = (id_pasien, id_kunjungan) => {
  const response = apiLocal.get(
    `/trend/${id_pasien}/${id_kunjungan}/tekanan-darah`,
  );
  return response;
};
