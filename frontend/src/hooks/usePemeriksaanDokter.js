import { useEffect, useState, useCallback, useRef } from "react";
import {
  getPemeriksaanDokter,
  updatePemeriksaanDokter,
} from "../services/pemeriksaanDokterService";
import { showToast } from "../utils/showToast";

export const usePemeriksaanDokter = () => {
  const [pemeriksaanDokter, setPemeriksaanDokter] = useState([]);

  const [errors, setErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPage, setLimitPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");

  const ambilPemeriksaanDokter = useCallback(
    async (page = 1) => {
      try {
        const res = await getPemeriksaanDokter(search, page, limitPage);
        const PemeriksaanDokterList = res.data.data;
        const paginationData = res.data.pagination;

        if (PemeriksaanDokterList.length >= 1) {
          setPemeriksaanDokter(PemeriksaanDokterList);
          setCurrentPage(paginationData.page);
          setTotalPage(paginationData.totalPage);
        } else {
          setPemeriksaanDokter([]);
        }
      } catch (error) {
        showToast(error.response?.data?.message, "Pemeriksaan-dokter", "error");
      }
    },
    [search],
  );

  useEffect(() => {
    ambilPemeriksaanDokter(currentPage);
  }, [search, currentPage]);

  return {
    pemeriksaanDokter,
    errors,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    totalPage,
  };
};
