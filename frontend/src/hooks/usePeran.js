import { useEffect, useState, useCallback, useRef } from "react";
import { useModalInfo } from "../context/ModalInfoProvider.js";
import { getPeran } from "../services/peranService.js";
import { showToast } from "../utils/showToast.js";

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
          setPeran([]);
        }
      }
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data peran",
        "peran",
      );
    }
  }, []);

  return {
    peran,
    ambilPeran,
  };
};
