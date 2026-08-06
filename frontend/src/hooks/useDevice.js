import { useState } from "react";
import { getDevice } from "../services/adminPanelServices";
import { useAuth } from "../context/AuthContext";

import { data } from "react-router-dom";
import { showToast } from "../utils/showToast";

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
      const deviceList = res?.data?.data || [];

      setDevices(deviceList);
      setCurrentPage(res.data.current_page);
      setTotalPage(res.data.total_pages);
    } catch (err) {
      // =========================================
      // HANDLE ERROR
      // =========================================
      if (err.response) {
        if (err.response.status === 401) {
          showToast(
            err.response?.data?.error.errors + ", Hubungi Admin" ||
              err.response?.data?.message,
            "medlink-device",
            "error",
          );

          return;
        }
        showToast(
          err.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data Alat kesehatan",
          "medlink-device",
          "error",
        );

        setError(err.response.data.message || "Ambil Device Gagal");
      } else {
        showToast("Server MedLink tidak terjangkau", "medlink-device", "error");

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
