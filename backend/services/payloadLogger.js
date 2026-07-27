const { io } = require("socket.io-client");
const axios = require("axios");
const db = require("../db");

const activeSockets = new Map();

function createSocket(gatewaySn) {
  const socket = io("wss://api.samelement.com", {
    transports: ["websocket"],
    reconnection: true,
    query: {
      gateway_sn: gatewaySn,
    },
  });

  socket.on("connect", () => {
    console.log(`[LOGGER] Connected gateway ${gatewaySn}`);
    socket.emit("join", gatewaySn);
  });

  socket.on("disconnect", () => {
    console.log(`[LOGGER] Disconnected gateway ${gatewaySn}`);
  });

  socket.onAny(async (eventName, data) => {
    try {
      await db.query(
        `
        INSERT INTO payload_medlink (listen_event, payload)
        VALUES (?, ?)
        `,
        [eventName, JSON.stringify(data)],
      );
    } catch (err) {
      console.error("[LOGGER ERROR]", err);
    }
  });

  return socket;
}

async function getGateways() {
  const res = await axios.get(
    "https://api.samelement.com/integration/v1/iot-gateways",
    {
      params: {
        page: 1,
        limit: 999,
      },
      headers: {
        "Content-Type": "application/json",
        "x-client-id": "HS261B9A17",
        "x-server-key":
          "eml-server-key-00d012ad41f7756790cba1d6e3285ffb2738ded5d94926246446bef792f22497",
      },
    },
  );

  return res?.data?.data?.data || [];
}

async function syncGateways() {
  try {
    const gateways = await getGateways();

    gateways.forEach((gateway) => {
      const gatewaySn = gateway.id;

      if (!gatewaySn) return;

      const socket = activeSockets.get(gatewaySn);
      const isConnected = socket?.connected ?? false;

      // Gateway aktif tapi belum terkoneksi
      if (gateway.status === true && !isConnected) {
        const socket = createSocket(gatewaySn);

        activeSockets.set(gatewaySn, socket);

        console.log(`[LOGGER] Gateway ${gatewaySn} berubah menjadi aktif`);
      }

      // Gateway nonaktif tapi masih terkoneksi
      if (gateway.status === false && isConnected) {
        const socket = activeSockets.get(gatewaySn);

        socket.disconnect();

        activeSockets.delete(gatewaySn);

        console.log(`[LOGGER] Gateway ${gatewaySn} berubah menjadi nonaktif`);
      }
    });
  } catch (error) {
    console.error("[SYNC GATEWAY ERROR]", error.message);
  }
}

async function startMedlinkLogger() {
  try {
    // Sinkronisasi pertama saat aplikasi start
    await syncGateways();

    // Sinkronisasi berkala
    setInterval(async () => {
      await syncGateways();
    }, 60 * 85); // 30 detik

    console.log("[LOGGER] Medlink logger started");
  } catch (error) {
    console.error("[LOGGER INIT ERROR]", error.message);
  }
}

module.exports = startMedlinkLogger;
