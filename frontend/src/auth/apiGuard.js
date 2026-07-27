import { hasPermission } from "./auth";

export const withPermission = (permission, apiCall) => {
  return async (...args) => {
    // =========================================
    // CHECK FRONTEND PERMISSION
    // =========================================
    if (!hasPermission(permission)) {
      throw {
        response: {
          data: {
            message: "Anda tidak memiliki akses",
          },
        },
      };
    }

    // =========================================
    // EXECUTE API
    // =========================================
    return apiCall(...args);
  };
};
