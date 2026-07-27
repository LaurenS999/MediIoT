import { useEffect, useRef, useState } from "react";
import { getGateway } from "../services/adminPanelServices";
import { toast } from "react-toastify";

export default function useGateway() {
  const [gateway, setGateway] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      if (error.response?.status === 401) {
        toast.error(
          error.response?.data?.error.errors + ", Hubungi Admin" ||
            error.response?.data?.message,
          { toastId: "medlink-gateway-access-code-error" },
        );
        return;
      }

      // =========================================
      // HANDLE ERROR
      // =========================================
      if (error.response) {
        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data gateway",
        );

        setError(error.response.data.message || "Ambil Gateway Gagal");
      } else {
        toast.error("Server MedLink tidak terjangkau", {
          toastId: "gateway-server-tidak-terjangkau",
        });

        setError("Server MedLink tidak terjangkau");
      }

      // =========================================
      // RESET DEVICE
      // =========================================
      setGateway([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    gateway,

    ambilGateway,
  };
}
