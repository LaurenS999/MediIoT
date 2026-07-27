import apiLocal from "./apiLocal.js";

export const getAccessToken = () => {
  const response = apiLocal.get(`/access_token`);
  return response;
};

export const createAccessToken = (data) => {
  const response = apiLocal.post(`/access_token`, data);
  return response;
};
