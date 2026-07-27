import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_MEDLINK_URL,

  headers: {
    "Content-Type": "application/json",
    "x-client-id": process.env.REACT_APP_CLIENT_ID,
    "x-server-key": process.env.REACT_APP_SERVER_KEY,
  },
});

export default api;
