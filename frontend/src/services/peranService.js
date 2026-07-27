import apiLocal from "./apiLocal.js";

export const getPeran = () => {
  return apiLocal.get(`/peran`);
};

export const createPeran = (data) => {
  return apiLocal.post("/peran", data);
};
