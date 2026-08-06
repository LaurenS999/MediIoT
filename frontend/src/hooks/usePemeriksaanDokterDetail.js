import { useEffect, useState, useCallback, useRef } from "react";
import {
  getDetailPemeriksaanDokter,
  updatePemeriksaanDokter,
} from "../services/pemeriksaanDokterService";
import { showToast } from "../utils/showToast";

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
        showToast(
          error.response?.data?.message ||
            "Terjadi kesalaha saat mengambil data",
          "pemeriksaan-dokter-detail",
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
