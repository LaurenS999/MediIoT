import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { useModalInfo } from "../context/ModalInfoProvider.js";
import { getPeran } from "../services/peranService.js";
import { getKunjungan } from "../services/kunjunganService.js";
import { formToJSON } from "axios";

export const useKunjungan = () => {
  const [kunjungan, setKunjungan] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPage, setLimitPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");

  const ambilKunjungan = useCallback(async (page = 1) => {
    try {
      const res = await getKunjungan(search, page, limitPage);
      console.log("RESPON : ", currentPage);
      const kunjunganList = res.data;

      if (Array.isArray(kunjunganList)) {
        if (kunjunganList.length >= 1) {
          setKunjungan(kunjunganList);
          setCurrentPage(res.pagination.page);
          setTotalPage(res.pagination.totalPage);
        } else {
          toast.info("kunjungan Tidak ditemukan", {
            toastId: "riwayat-kunjungan-kosong",
          });
          setKunjungan([]);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message, {
        toastId: "kunjungan-error",
      });
    }
  }, []);

  useEffect(() => {
    ambilKunjungan(currentPage);
  }, [search, currentPage]);

  return {
    kunjungan,
    currentPage,
    setCurrentPage,
    totalPage,
    search,
    setSearch,
  };
};
