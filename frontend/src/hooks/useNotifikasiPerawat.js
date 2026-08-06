import { useCallback, useEffect, useState } from "react";
import { getNotifikasiPerawat } from "../services/notifikasiService";
import { useAuth } from "../context/AuthContext";

export default function useNotifikasiPerawat() {
  const { user } = useAuth();
  const [notifikasi, setNotifikasi] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await getNotifikasiPerawat();
      setNotifikasi(response.data.data || []);
      setCount(response.data.jumlah.Jumlah_notif || 0);
    } catch (error) {
      console.error("Gagal mengambil notifikasi dokter:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role == "perawat" || user?.role == "super admin") {
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
