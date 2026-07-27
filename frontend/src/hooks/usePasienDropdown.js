import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { getPasienDrowdown } from "../services/pasienService.js";

import { useModalInfo } from "../context/ModalInfoProvider.js";

export const usePasienDropdown = () => {
  const [pasien, setPasien] = useState([]);

  const ambilPasienDropdown = useCallback(async () => {
    try {
      const res = await getPasienDrowdown();
      const pasienList = res.data.data;
      const paginationData = res.data.pagination;

      if (Array.isArray(pasienList)) {
        if (pasienList.length >= 1) {
          setPasien(pasienList);
        } else {
          toast.info("Pasien Tidak ditemukan");
          setPasien([]);
        }
      }
    } catch (error) {
      toast.error(
        "Data Pasien : " + error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data pasien",
        { toastId: "pasien-dropdown-get-toast-error" },
      );
    }
  }, []);

  return {
    pasien,
    ambilPasienDropdown,
  };
};
