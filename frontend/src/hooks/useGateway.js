import { useEffect, useRef, useState } from "react";
import { getGateway } from "../services/adminPanelServices";
import { toast } from "react-toastify";

export default function useGateway() {
  const [gateway, setGateway] = useState([]);

  const ambilGateway = async () => {
    try {
      const result = await getGateway();

      setGateway(result.data.data || []);

      if (gateway.length == 0) {
        toast.info("Data gateway kosong", {
          toastId: "medlink-gateway-kosong",
        });
      }
    } catch (error) {
      if (err.response.status === 401) {
        toast.error(
          err.response?.data?.error.errors + ", Hubungi Admin" ||
            err.response?.data?.message,
          { toastId: "medlink-gateway-access-code-error" },
        );
        return;
      }

      // =========================================
      // HANDLE ERROR
      // =========================================
      if (err.response) {
        console.log(err.response);
        toast.error(
          err.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data gateway",
        );

        setError(err.response.data.message || "Ambil Gateway Gagal");
      } else {
        toast.error("Server MedLink tidak terjangkau", {
          toastId: "gateway-server-tidak-terjangkau",
        });

        setError("Server MedLink tidak terjangkau");
      }

      // =========================================
      // RESET DEVICE
      // =========================================
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    gateway,

    ambilGateway,
  };
}
