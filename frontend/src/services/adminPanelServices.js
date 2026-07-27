import api from "./api";

export const getDevice = async (params) => {
  console.log(api.defaults.baseURL + "integration/v1/devices");

  const response = await api({
    method: "get",
    url: "integration/v1/devices",
    params: params,
  });
  return response.data;
};

export const getBMI = async ({ height, age, gender, weight, impedance }) => {
  const response = await api.get(
    "integration/v1/bmi/get-calculate-health-metrics",
    {
      params: {
        height,
        age,
        gender,
        weight,
        impedance,
      },
    },
  );

  return response.data;
};

export const getGateway = async () => {
  const response = await api.get("/integration/v1/iot-gateways", {
    params: {
      page: 1,
      limit: 999,
    },
  });
  return response.data;
};

export const getJenisPengukuran = async () => {
  const response = await api.get("/integration/v1/measurement-parameter");
  return response.data;
};
