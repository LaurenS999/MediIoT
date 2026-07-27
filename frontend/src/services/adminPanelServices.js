import apiLocal from "./apiLocal";

export const getDevice = async (params) => {
  const response = await apiLocal({
    method: "get",
    url: "medlink/devices",
    params: params,
  });
  return response.data;
};

export const getBMI = async ({ height, age, gender, weight, impedance }) => {
  const response = await apiLocal.get("medlink/bmi", {
    params: {
      height,
      age,
      gender,
      weight,
      impedance,
    },
  });

  return response.data;
};

export const getGateway = async () => {
  const response = await apiLocal.get("/medlink/gateway", {
    params: {
      page: 1,
      limit: 999,
    },
  });
  return response.data;
};

export const getJenisPengukuran = async () => {
  const response = await apiLocal.get("/medlink/jenis-pengukuran");
  return response.data;
};
