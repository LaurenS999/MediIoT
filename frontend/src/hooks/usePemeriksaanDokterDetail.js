import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import {
  getDetailPemeriksaanDokter,
  updatePemeriksaanDokter,
} from "../services/pemeriksaanDokterService";

export const usePemeriksaanDokterDetail = (id_kunjungan) => {
  const [pasien, setPasien] = useState([]);
  const [pemeriksaan, setPemeriksaan] = useState([]);
  const [pengukuran, setPengukuran] = useState(null);

  const [errors, setErrors] = useState({});

  const ambilDetailPemeriksaan = useCallback(
    async (id_kunjungan) => {
      try {
        const res = await getDetailPemeriksaanDokter(id_kunjungan);
        const DataDetailPemeriksaan = res.data.data;

        setPasien(DataDetailPemeriksaan.pasien);
        setPemeriksaan(DataDetailPemeriksaan.sesi);
        setPengukuran(DataDetailPemeriksaan.pengukuran);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data pasien",
          {
            toastId: "pemeriksaan-dokter-tidak-ditemukan",
          },
        );
      }
    },
    [id_kunjungan],
  );

  useEffect(() => {
    ambilDetailPemeriksaan(id_kunjungan);
  }, [id_kunjungan]);

  return {
    pasien,
    pemeriksaan,
    pengukuran,
    errors,
  };
};
