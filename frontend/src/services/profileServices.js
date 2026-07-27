import apiLocal from "./apiLocal.js";

export const updateProfile = (data) => {
  return apiLocal.put(`/profile`, data);
};

export const updateProfileUser = (data) => {
  return apiLocal.patch(`/profile/user`, data);
};

export const updateProfilePassword = (data) => {
  return apiLocal.patch(`/profile/password`, data);
};
