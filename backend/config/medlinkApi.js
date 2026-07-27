const axios = require("axios");

const medlinkApi = axios.create({
  baseURL: process.env.MEDLINK_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = medlinkApi;
