const medlinkApi = require("../config/medlinkApi");
const { getAccessToken } = require("./accessTokenService");

const requestMedlink = async (config) => {
  const { client_id, client_key, server_key } = await getAccessToken();
  console.log("CLIENT ID : ", client_id);
  console.log("CLIENT KEY : ", client_key);
  console.log("SERVER KEY : ", server_key);

  const response = await medlinkApi({
    ...config,

    headers: {
      ...config.headers,

      "x-client-id": client_id,
      "x-server-key": server_key,

      // Tambahkan jika memang dibutuhkan oleh Medlink
      // "x-client-key": client_key,
    },
  });

  return response.data;
};

module.exports = requestMedlink;
