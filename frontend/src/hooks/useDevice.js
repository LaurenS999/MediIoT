import { useState } from "react";
import { getDevice } from "../services/adminPanelServices";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function useDevice() {
  // =========================================
  // STATE
  // =========================================
  const [devices, setDevices] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPage, setLimitPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  // =========================================
  // AMBIL DEVICE
  // =========================================
  const ambilListDevice = async (payload = {}) => {
    setLoading(true);

    setError("");

    try {
      const res = await getDevice(payload);
      console.log("PARAMS : ", payload);
      console.log("RESPONSE : ", res.data);
      const deviceList = res?.data?.data || [];

      setDevices(deviceList);
      setCurrentPage(res.data.current_page);
      setTotalPage(res.data.total_pages);
    } catch (err) {
      console.log(err);

      // =========================================
      // HANDLE ERROR
      // =========================================
      if (err.response) {
        console.log(err.response);
        toast.error(
          err.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data Alat kesehatan",
        );

        setError(err.response.data.message || "Ambil Device Gagal");
      } else {
        toast.error("Server MedLink tidak terjangkau", {
          toastId: "device-server-tidak-terjangkau",
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

  // =========================================
  // RETURN
  // =========================================
  return {
    devices,
    setDevices,

    loading,
    error,
    currentPage,
    setCurrentPage,
    limitPage,
    totalPage,

    ambilListDevice,
  };
}
