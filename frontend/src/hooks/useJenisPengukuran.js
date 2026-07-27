import { useEffect, useRef, useState } from "react";
import { getJenisPengukuran } from "../services/adminPanelServices";
import { toast } from "react-toastify";
export default function useJenisPengukuran() {
  const [jenisPengukuran, setJenisPengukuran] = useState([]);

  const ambilJenisPengukuran = async () => {
    try {
      const result = await getJenisPengukuran();

      setJenisPengukuran(Object.values(result.data || {}));
    } catch (error) {
      console.log(error);
      toast.error("Server MedLink Tidak Terjangkau");
      // toast.error(error);
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
