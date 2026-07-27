import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";

import { useModalInfo } from "../context/ModalInfoProvider.js";
import { getPendaftaranCheckIn } from "../services/pendaftaranService.js";
import { useAuth } from "../context/AuthContext.js";

export const usePendaftaranCheckIn = () => {
  const { user } = useAuth();
  const [pendaftaran, setPendaftaran] = useState([]);

  const ambilpendaftaranCheckIn = useCallback(async () => {
    try {
      const res = await getPendaftaranCheckIn();
      console.log("RESPON LIST CHECK IN : ", res);

      const pendaftaranList = res.data.data;
      console.log("PENDAFTARAN LIST CHECK IN : ", pendaftaranList);
      if (Array.isArray(pendaftaranList)) {
        if (pendaftaranList.length >= 1) {
          setPendaftaran(pendaftaranList);
        } else {
          toast.info("Pasien Tidak ditemukan");
          setPendaftaran([]);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data pendaftaran",
      );
    }
  }, []);

  useEffect(() => {
    ambilpendaftaranCheckIn();
  }, []);

  return {
    pendaftaran,
  };
};
