import { useEffect, useRef, useState } from "react";
import { getJenisPengukuran } from "../services/adminPanelServices";
import { toast } from "react-toastify";
import jenisPengukuranConfig from "../config/jenisPengukuranConfig";

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
          toast.error(
            error.response?.data?.error.errors + ", Hubungi Admin" ||
              error.response?.data?.message,
            {
              toastId: "medlink-jenis-pengukuran-access-code-error",
            },
          );

          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data Alat kesehatan",
          {
            toastId: "medlink-jenis-pengukuran-error",
          },
        );

        setError(error.response.data.message || "Ambil Device Gagal");

        return;
      }

      toast.error("Server MedLink tidak terjangkau", {
        toastId: "jenis-pengukuran-server-tidak-terjangkau",
      });

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
