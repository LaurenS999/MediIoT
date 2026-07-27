import apiLocal from "./apiLocal.js";

export const getUser = (search, page, limit) => {
  return apiLocal.get(`/user?search=${search}&page=${page}&limit=${limit}`);
};

export const createUser = (data) => {
  return apiLocal.post("/user", data);
};

export const updateUser = (id_User, data) => {
  return apiLocal.put(`/user/${id_User}`, data);
};

export const updateProfileUser = (data) => {
  return apiLocal.put(`/profile`, data);
};

export const deleteUser = (id_User, role) => {
  return apiLocal.delete(`/user/${id_User}`, {
    data: {
      role: role,
    },
  });
};

export const postLogin = (data) => {
  return apiLocal.post(`/user/login`, data);
};
