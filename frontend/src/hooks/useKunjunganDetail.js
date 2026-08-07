import { useEffect, useState, useCallback, useRef } from "react";
import { useModalInfo } from "../context/ModalInfoProvider.js";
import { getPeran } from "../services/peranService.js";
import {
  getKunjunganDetail_Terakhir,
  getKunjunganPasien,
  getKunjunganSelectedRiwayat,
} from "../services/kunjunganService.js";
import { showToast } from "../utils/showToast.js";

export const useKunjunganDetail = (id_pasien) => {
  const [kunjungan, setKunjungan] = useState([]);
  const [daftarKunjungan, setDaftarKunjungan] = useState([]);
  const [pengukuran, setPengukuran] = useState([]);
  const [pemeriksaan, setPemeriksaan] = useState([]);
  const id_pasien_detail = id_pasien;

  const [loadingDaftarKunjungan, setLoadingDaftarKunjungan] = useState(true);
  const measurementRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPage, setLimitPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const ambilDaftarKunjunga = useCallback(
    async (id_pasien, page = 1, limit = 10) => {
      try {
        const res = await getKunjunganPasien(id_pasien, page, limit);
        const kunjunganList = res.data;

        if (Array.isArray(kunjunganList)) {
          if (kunjunganList.length >= 1) {
            setDaftarKunjungan(res.data);

            setCurrentPage(res.pagination.page);
            setTotalPage(res.pagination.totalPage);
          } else {
            setDaftarKunjungan([]);
          }
        }
      } catch (error) {
        showToast(
          error.response?.data?.message ||
            "Terjadi Kesalahan saat mengambil data kunjungan pasien",
          "kunjungan-detail",
          "error",
        );
      } finally {
        setLoadingDaftarKunjungan(false);
      }
    },
  );

  const ambilKunjunganTerakhir = useCallback(async (id_pasien) => {
    try {
      const res = await getKunjunganDetail_Terakhir(id_pasien);

      setKunjungan(res.data.kunjungan);

      // ================================
      // PENGUKURAN
      // ================================
      if (
        !Array.isArray(res.data.pengukuran) ||
        res.data.pengukuran.length === 0
      ) {
        setPengukuran([]);
      } else {
        setPengukuran(res.data.pengukuran);
      }

      // ================================
      // PEMERIKSAAN
      // ================================
      if (
        !Array.isArray(res.data.pemeriksaan) ||
        res.data.pemeriksaan.length === 0
      ) {
        setPemeriksaan([]);
      } else {
        setPemeriksaan(res.data.pemeriksaan);
      }
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data Kunjungan terakhir",
        "kunjungan-detail",
        "error",
      );
    }
  }, []);

  const handleSelectKunjungan = async (id_pasien, id_kunjungan) => {
    if (!id_kunjungan) {
      showToast("Belum memilih kunjungan", "kunjungan-detail", "warning");
      return;
    }
    try {
      const response = await getKunjunganSelectedRiwayat(
        id_pasien,
        id_kunjungan,
      );

      setKunjungan(response.data.kunjungan);
      setPemeriksaan(response.data.pemeriksaan);
      setPengukuran(response.data.pengukuran);

      showToast(
        "Data hasil pemeriksaan dan pengukuran berhasil ditampilkan",
        "kunjungan-detail",
        "success",
      );

      setTimeout(() => {
        if (measurementRef.current) {
          const navbarHeight = 80;

          const elementPosition =
            measurementRef.current.getBoundingClientRect().top +
            window.pageYOffset;

          window.scrollTo({
            top: elementPosition - navbarHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    } catch (error) {
      console.error(error);
      showToast(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data Kunjungan terakhir",
        "kunjungan-detail",
        "error",
      );
    } finally {
      setLoadingDaftarKunjungan(false);
    }
  };

  useEffect(() => {
    ambilDaftarKunjunga(id_pasien, currentPage, limitPage);
    ambilKunjunganTerakhir(id_pasien);
  }, [id_pasien, currentPage]);

  return {
    kunjungan,
    daftarKunjungan,
    pengukuran,
    pemeriksaan,
    handleSelectKunjungan,
    loadingDaftarKunjungan,
    setLoadingDaftarKunjungan,
    measurementRef,

    currentPage,
    setCurrentPage,
    limitPage,
    totalPage,
  };
};
