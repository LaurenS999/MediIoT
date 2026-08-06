import { useEffect, useRef, useState } from "react";
import { getJenisPengukuran } from "../services/adminPanelServices";

import jenisPengukuranConfig from "../config/jenisPengukuranConfig";
import { showToast } from "../utils/showToast";

export default function useJenisPengukuran() {
  const [jenisPengukuran, setJenisPengukuran] = useState([]);
  const [error, setError] = useState("");

  const ambilJenisPengukuran = async () => {
    try {
      const result = await getJenisPengukuran();

      console.log("RESULT : ", result);

      const data = Object.values(result.data || {});

      const dataCustom = data.map((jenis) => {
        const config = jenisPengukuranConfig[jenis];

        return {
          nama: config?.nama || jenis,
          jenis_pengukuran: jenis,
          grup: config?.grup || "Lainnya",
        };
      });

      setJenisPengukuran(dataCustom);
    } catch (error) {
      // =========================================
      // HANDLE ERROR
      // =========================================
      if (error.response) {
        if (error.response.status === 401) {
          showToast(
            error.response?.data?.error.errors + ", Hubungi Admin" ||
              error.response?.data?.message,
            "medlink-jenis-pengukuran",
            "error",
          );

          return;
        }
        showToast(
          error.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data Alat kesehatan",
          "medlink-jenis-pengukuran",
          "error",
        );

        setError(error.response.data.message || "Ambil Device Gagal");

        return;
      }

      showToast(
        "Server MedLink tidak terjangkau",
        "medlink-jenis-pengukuran",
        "error",
      );

      setError("Server MedLink tidak terjangkau");
    }
  };

  const fetchedRef = useRef();
  useEffect(() => {
    if (fetchedRef.current) return;

    fetchedRef.current = true;
    ambilJenisPengukuran();
  }, []);

  return {
    jenisPengukuran,
  };
}
