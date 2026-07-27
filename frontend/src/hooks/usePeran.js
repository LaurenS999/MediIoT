import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { useModalInfo } from "../context/ModalInfoProvider.js";
import { getPeran } from "../services/peranService.js";

export const usePeran = () => {
  const [peran, setPeran] = useState([]);

  const ambilPeran = useCallback(async () => {
    try {
      const res = await getPeran();
      const peranList = res.data.data;

      if (Array.isArray(peranList)) {
        if (peranList.length >= 1) {
          setPeran(peranList);
        } else {
          toast.info("Peran Tidak ditemukan");
          setPeran([]);
        }
      }
    } catch (error) {
      toast.error(
        "Data Peran : " + error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data peran",
        { toastId: "Peran-get-toast-error" },
      );
    }
  }, []);

  // useEffect(() => {
  //   ambilPeran();
  // }, []);

  return {
    peran,
    ambilPeran,
  };
};
