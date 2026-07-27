const requestMedlink = require("./medlinkRequestService.js");

const getDevice = async (params) => {
  return await requestMedlink({
    method: "GET",
    url: "integration/v1/devices",
    params,
  });
};

const getBMI = async ({ height, age, gender, weight, impedance }) => {
  return await requestMedlink({
    method: "GET",
    url: "integration/v1/bmi/get-calculate-health-metrics",

    params: {
      height,
      age,
      gender,
      weight,
      impedance,
    },
  });
};

const getGateway = async () => {
  return await requestMedlink({
    method: "GET",
    url: "integration/v1/iot-gateways",

    params: {
      page: 1,
      limit: 999,
    },
  });
};

const getJenisPengukuran = async () => {
  return await requestMedlink({
    method: "GET",
    url: "integration/v1/measurement-parameter",
  });
};

module.exports = {
  getDevice,
  getBMI,
  getGateway,
  getJenisPengukuran,
};
