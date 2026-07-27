import apiLocal from "./apiLocal";

export const getStatusDevice = async () => {
  const response = await apiLocal.get("/status-alat");
  return response.data;
};

export const createStatusDevice = async (params) => {
  const response = await apiLocal.post("/status-alat", params);
  return response.data;
};

export const deleteStatusDevice = async (mac_address) => {
  const response = await apiLocal.delete("/status-alat", {
    data: {
      mac_address,
    },
  });

  return response.data;
};

export const updateHeartBeatDevice = async (mac_address) => {
  const response = await apiLocal.patch("/status-alat/heartbeat", {
    mac_address,
  });
  return response.data;
};
