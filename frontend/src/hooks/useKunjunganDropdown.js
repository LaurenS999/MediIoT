import { useEffect, useState, useCallback, useRef } from "react";
import { getKunjunganPasienDropDown } from "../services/kunjunganService.js";

import { useModalInfo } from "../context/ModalInfoProvider.js";
import { showToast } from "../utils/showToast.js";

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
          setKunjunganDropdown([]);
        }
      }
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data pasien",
        "kunjungan-dropdown",
        "error",
      );
    }
  }, []);

  return {
    kunjunganDropdown,
    ambilKunjunganDropdown,
  };
};
