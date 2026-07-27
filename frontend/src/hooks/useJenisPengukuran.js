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
      console.log(error);
      if (error.response.status === 401) {
        toast.error(
          error.response?.data?.error.errors + ", Hubungi Admin" ||
            error.response?.data?.message,
          { toastId: "medlink-jenis-pengukuran-access-code-error" },
        );
        return;
      }

      // =========================================
      // HANDLE ERROR
      // =========================================
      if (error.response) {
        console.log(error.response);
        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data Alat kesehatan",
        );

        setError(error.response.data.message || "Ambil Device Gagal");
      } else {
        toast.error("Server MedLink tidak terjangkau", {
          toastId: "jenis-pengukuran-server-tidak-terjangkau",
        });

        setError("Server MedLink tidak terjangkau");
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
