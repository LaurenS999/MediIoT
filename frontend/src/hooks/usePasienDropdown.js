import { useEffect, useState, useCallback, useRef } from "react";
import { getPasienDrowdown } from "../services/pasienService.js";

import { useModalInfo } from "../context/ModalInfoProvider.js";
import { showToast } from "../utils/showToast.js";

export const usePasienDropdown = () => {
  const [pasien, setPasien] = useState([]);

  const ambilPasienDropdown = useCallback(async (id_relasi) => {
    try {
      const res = await getPasienDrowdown(id_relasi);
      const pasienList = res.data.data;
      const paginationData = res.data.pagination;

      if (Array.isArray(pasienList)) {
        if (pasienList.length >= 1) {
          setPasien(pasienList);
        } else {
          setPasien([]);
        }
      }
    } catch (error) {
      showToast(error.response?.data?.message, "pasien-dropdown", "error");
    }
  }, []);

  return {
    pasien,
    ambilPasienDropdown,
  };
};
