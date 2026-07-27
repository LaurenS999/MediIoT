import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import {
  getPemeriksaanDokter,
  updatePemeriksaanDokter,
} from "../services/pemeriksaanDokterService";

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
          toast.info("Tidak ada Pemeriksaan Dokter", {
            toastId: "pemeriksaan-dokter-kosong",
          });
          setPemeriksaanDokter([]);
        }
      } catch (error) {
        toast.error(error.response?.data?.message, {
          toastId: "Pemeriksaan-dokter-error",
        });
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
