import { useEffect, useRef, useState } from "react";
import { getJenisPengukuran } from "../services/adminPanelServices";
import { toast } from "react-toastify";
export default function useJenisPengukuran() {
  const [jenisPengukuran, setJenisPengukuran] = useState([]);
  const [error, setError] = useState("");

  const ambilJenisPengukuran = async () => {
    try {
      const result = await getJenisPengukuran();

      setJenisPengukuran(Object.values(result.data || {}));
    } catch (error) {
      // =========================================
      // HANDLE ERROR
      // =========================================
      if (error.response) {
        if (error.response.status === 401) {
          toast.error(
            error.response?.data?.error.errors + ", Hubungi Admin" ||
              error.response?.data?.message,
            { toastId: "medlink-jenis-pengukuran-access-code-error" },
          );
          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data Alat kesehatan",
          { toastId: "medlink-jenis-pengukuran-error" },
        );

        setError(error.response.data.message || "Ambil Device Gagal");
        return;
      } else {
        toast.error("Server MedLink tidak terjangkau", {
          toastId: "jenis-pengukuran-server-tidak-terjangkau",
        });

        setError("Server MedLink tidak terjangkau");
        return;
      }
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
