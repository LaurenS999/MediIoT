import { permissions } from "./permissions";

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const getRole = () => {
  return getUser()?.role || null;
};

export const hasPermission = (permission) => {
  const role = getRole();

  if (!role) return false;

  const rolePermissions = permissions[role] || [];

  return rolePermissions.includes(permission);
};
