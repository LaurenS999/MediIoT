import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { pengukuranSocketMap } from "../config/pengukuranSocketMap";
import { toast } from "react-toastify";

export default function usePengukuranSocketEngine({
  devices,
  setLiveData,
  setGatewayStatus,
}) {
  const socketsRef = useRef([]);
  const invalidMacRef = useRef([]);

  useEffect(() => {
    if (!devices?.length) return;

    // =====================================
    // CLEAR OLD SOCKET
    // =====================================
    socketsRef.current.forEach((socket) => {
      socket.disconnect();
    });

    socketsRef.current = [];

    // =====================================
    // GET UNIQUE GATEWAY
    // =====================================
    const uniqueGateways = [
      ...new Set(devices.map((d) => d.gateway_id).filter(Boolean)),
    ];

    console.log("UNIQUE GATEWAYS:", uniqueGateways);

    // =====================================
    // CREATE SOCKET PER GATEWAY
    // =====================================
    uniqueGateways.forEach((gatewayId) => {
      const socket = io(process.env.REACT_APP_SOCKET_URL_PRODUCTION, {
        transports: ["websocket"],

        query: {
          gateway_sn: gatewayId,
        },

        reconnection: true, // WAJIB
        reconnectionAttempts: 3, // atau angka tertentu
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      socketsRef.current.push(socket);

      // =====================================
      // CONNECT
      // =====================================
      socket.on("connect", () => {
        console.log("CONNECTED:", gatewayId);
        toast.success("Sucess Koneksi WebSocket");

        setGatewayStatus((prev) => ({
          ...prev,
          [gatewayId]: true,
        }));

        socket.emit("join", gatewayId);
      });

      // =====================================
      // DISCONNECT
      // =====================================
      socket.on("disconnect", () => {
        console.log("DISCONNECTED:", gatewayId);
        toast.success("Koneksi Websocket berhasil diputus");

        setGatewayStatus((prev) => ({
          ...prev,
          [gatewayId]: false,
        }));
      });

      // =====================================
      // CONNECT ERROR
      // =====================================
      socket.on("connect_error", (error) => {
        toast.warn(`CONNECT ERROR GATEWAY ${gatewayId}:`, error.message);
        console.error(`CONNECT ERROR GATEWAY ${gatewayId}:`, error.message);
      });

      // =====================================
      // RECONNECT FAILED
      // =====================================
      socket.io.on("reconnect_failed", () => {
        console.error(`RECONNECT FAILED GATEWAY ${gatewayId}`);

        toast.error(`Gagal menghubungkan kembali ke gateway ${gatewayId}`);

        setGatewayStatus((prev) => ({
          ...prev,
          [gatewayId]: false,
        }));
      });

      // =====================================
      // REGISTER EVENT
      // =====================================
      devices.forEach((device) => {
        // =====================================
        // HANYA DEVICE DARI GATEWAY INI
        // =====================================
        if (device.gateway_id !== gatewayId) return;

        const config = pengukuranSocketMap[device.device_function];

        if (!config) {
          console.warn("NO SOCKET CONFIG:", device.device_function);
          toast.warn("NO SOCKET CONFIG:", device.device_function);

          return;
        }

        socket.on(config.event, async (data) => {
          const payload = data?.[config.dataKey];
          console.log("PAYLOAD : ", payload);

          if (!payload) return;

          // =====================================
          // NORMALIZE PAYLOAD
          // =====================================
          const normalizedPayload =
            config.macType === "array" ? payload[0] : payload;

          if (!normalizedPayload) return;

          const mac = normalizedPayload?.mac;

          if (!mac) return;

          // =====================================
          // FILTER BERDASARKAN MAC DEVICE
          // =====================================
          if (mac.toLowerCase() !== device.mac_address.toLowerCase()) {
            const macSudahDiberiNotifikasi =
              invalidMacRef.current.includes(mac);

            if (!macSudahDiberiNotifikasi) {
              invalidMacRef.current.push(mac);

              toast.info(
                "Data pengukuran yang diterima bukan dari alat yang dipilih",
              );
            }

            return;
          }

          // =====================================
          // SAVE LIVE DATA
          // =====================================
          setLiveData((prev) => ({
            ...prev,

            [device.mac_address]: normalizedPayload,
          }));
          toast.success("Data pengukuran berhasil diterima");
        });
      });
    });

    // =====================================
    // CLEANUP
    // =====================================
    return () => {
      socketsRef.current.forEach((socket) => {
        socket.disconnect();
      });
      socketsRef.current = [];
    };
  }, [devices, setLiveData, setGatewayStatus]);
}
