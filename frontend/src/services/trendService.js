import apiLocal from "./apiLocal.js";

export const getTrendBerat = (id, interval) => {
  const response = apiLocal.get(`/trend/${id}/${interval}/berat-badan`);
  return response;
};

export const getTrendFat = (id, interval) => {
  const response = apiLocal.get(`/trend/${id}/${interval}/body-fat`);
  return response;
};

export const getTrendMuscle = (id, interval) => {
  const response = apiLocal.get(`/trend/${id}/${interval}/muscle-mass`);
  return response;
};

export const getTrendTensi = (id, interval) => {
  const response = apiLocal.get(`/trend/${id}/${interval}/tekanan-darah`);
  return response;
};
