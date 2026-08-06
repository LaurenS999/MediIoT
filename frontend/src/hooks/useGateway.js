import { useEffect, useRef, useState } from "react";
import { getGateway } from "../services/adminPanelServices";
import { toast } from "react-toastify";
import { showToast } from "../utils/showToast";

export default function useGateway() {
  const [gateway, setGateway] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ambilGateway = async () => {
    try {
      const result = await getGateway();

      setGateway(result.data.data || []);

      if (gateway.length == 0) {
        showToast("Data gateway kosong", "medlink-gateway", "info");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        showToast(
          error.response?.data?.error.errors + ", Hubungi Admin" ||
            error.response?.data?.message,
          "medlink-gateway",
          "error",
        );

        return;
      }

      // =========================================
      // HANDLE ERROR
      // =========================================
      if (error.response) {
        showToast(
          error.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data gateway",
          "medlink-gateway",
          "error",
        );

        setError(error.response.data.message || "Ambil Gateway Gagal");
      } else {
        showToast(
          "Server MedLink tidak terjangkau",
          "medlink-gateway",
          "error",
        );

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
