import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { getKunjunganPasienDropDown } from "../services/kunjunganService.js";

import { useModalInfo } from "../context/ModalInfoProvider.js";

export const useKunjunganDropdown = () => {
  const [kunjunganDropdown, setKunjunganDropdown] = useState([]);

  const ambilKunjunganDropdown = useCallback(async (id_relasi) => {
    try {
      const res = await getKunjunganPasienDropDown(id_relasi);
      console.log("RESPONS ", res);
      const KunjunganList = res.data;

      if (Array.isArray(KunjunganList)) {
        if (KunjunganList.length >= 1) {
          setKunjunganDropdown(KunjunganList);
        } else {
          // toast.info("Pasien Tidak ditemukan");
          setKunjunganDropdown([]);
        }
      }
    } catch (error) {
      toast.error(
        "Data Pasien : " + error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data pasien",
        { toastId: "kunjungan-dropdown-get-toast-error" },
      );
    }
  }, []);

  return {
    kunjunganDropdown,
    ambilKunjunganDropdown,
  };
};
