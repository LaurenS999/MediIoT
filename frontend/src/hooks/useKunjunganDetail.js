import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { useModalInfo } from "../context/ModalInfoProvider.js";
import { getPeran } from "../services/peranService.js";
import {
  getKunjunganDetail_Terakhir,
  getKunjunganPasien,
  getKunjunganSelectedRiwayat,
} from "../services/kunjunganService.js";

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
        console.log("RESPONSE : ", res);
        const kunjunganList = res.data;

        if (Array.isArray(kunjunganList)) {
          if (kunjunganList.length >= 1) {
            setDaftarKunjungan(res.data);

            setCurrentPage(res.pagination.page);
            setTotalPage(res.pagination.totalPage);
          } else {
            toast.info(res.data?.message);
            setDaftarKunjungan([]);
          }
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data kunjungan pasien",
        );
      } finally {
        setLoadingDaftarKunjungan(false);
      }
    },
  );

  const ambilKunjunganTerakhir = useCallback(async (id_pasien) => {
    try {
      const res = await getKunjunganDetail_Terakhir(id_pasien);
      console.log("RESPONS 123: ", res);
      setKunjungan(res.data.kunjungan);

      setPengukuran(res.data.pengukuran);

      if (res.data.pemeriksaan == []) {
        toast.info("PASIEN BELUM ADA PEMERIKSAAN");
        setPemeriksaan([]);
      } else {
        setPemeriksaan(res.data.pemeriksaan);
      }

      if (res.data.pemeriksaan == []) {
        toast.info("PASIEN BELUM ADA PEMERIKSAAN");
        setPengukuran([]);
      } else {
        setPengukuran(res.data.pengukuran);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data peran",
      );
    }
  }, []);

  const handleSelectKunjungan = async (id_pasien, id_kunjungan) => {
    try {
      const response = await getKunjunganSelectedRiwayat(
        id_pasien,
        id_kunjungan,
      );

      setKunjungan(response.data.kunjungan);
      setPemeriksaan(response.data.pemeriksaan);
      setPengukuran(response.data.pengukuran);

      toast.success(
        "Data hasil pemeriksaan dan pengukuran berhasil ditampilkan",
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
