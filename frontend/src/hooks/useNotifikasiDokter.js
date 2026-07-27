import { useCallback, useEffect, useState } from "react";
import { getNotifikasiDokter } from "../services/notifikasiService";
import { useAuth } from "../context/AuthContext";
import { notifikasiConfig } from "../config/notifikasiConfig";

export default function useNotifikasiDokter() {
  const { user } = useAuth();
  const [notifikasi, setNotifikasi] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await getNotifikasiDokter();

      setNotifikasi(response.data.data);
      setCount(response.data.jumlah.Jumlah_notif || 0);
    } catch (error) {
      console.error("Gagal mengambil notifikasi dokter:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role == "dokter") {
      fetchNotifications();

      const interval = setInterval(() => {
        fetchNotifications();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [fetchNotifications]);

  return {
    notifikasi,
    count,
    loading,
  };
}
