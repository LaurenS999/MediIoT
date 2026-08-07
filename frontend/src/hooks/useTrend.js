import { useEffect, useState, useCallback } from "react";
import { showToast } from "../utils/showToast.js";
import {
  getTrendBerat,
  getTrendMuscle,
  getTrendFat,
  getTrendTensi,
} from "../services/trendService.js";

export const useTrend = (id_pasien, pasienDetailStatus) => {
  const [trendBerat, setTrendBerat] = useState([]);
  const [trendFat, setTrendFat] = useState([]);
  const [trendMuscle, setTrendMuscle] = useState([]);
  const [trendTensi, setTrendTensi] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [errors, setErrors] = useState({});

  const ambilTrendBerat = useCallback(
    async (emptyTrend, id_kunjungan) => {
      try {
        const res = await getTrendBerat(id_pasien, id_kunjungan);
        const listBerat = res.data.data;
        if (Array.isArray(listBerat) && listBerat.length > 0) {
          setTrendBerat(listBerat);
        } else {
          setTrendBerat([]);
          emptyTrend.push("Berat Badan");
        }
      } catch (error) {
        showToast("Server tidak terjangkau", "trend", "error");
      }
    },
    [id_pasien],
  );

  const ambilTrendfat = useCallback(
    async (emptyTrend, id_kunjungan) => {
      try {
        const res = await getTrendFat(id_pasien, id_kunjungan);
        const listfat = res.data.data;
        if (Array.isArray(listfat) && listfat.length > 0) {
          setTrendFat(listfat);
        } else {
          setTrendFat([]);
          emptyTrend.push("Body Fat");
        }
      } catch (error) {
        showToast("Server tidak terjangkau", "trend", "error");
      }
    },
    [id_pasien],
  );

  const ambilTrendmuscle = useCallback(
    async (emptyTrend, id_kunjungan) => {
      try {
        const res = await getTrendMuscle(id_pasien, id_kunjungan);
        const listMuscle = res.data.data;

        if (Array.isArray(listMuscle) && listMuscle.length > 0) {
          setTrendMuscle(listMuscle);
        } else {
          setTrendMuscle([]);
          emptyTrend.push("Muscle Mass");
        }
      } catch (error) {
        showToast("Server tidak terjangkau", "trend", "error");
      }
    },
    [id_pasien],
  );

  const ambilTrendTensi = useCallback(
    async (emptyTrend, id_kunjungan) => {
      try {
        const res = await getTrendTensi(id_pasien, id_kunjungan);
        const listTensi = res.data.data;
        if (Array.isArray(listTensi) && listTensi.length > 0) {
          setTrendTensi(listTensi);
        } else {
          setTrendTensi([]);
          emptyTrend.push("Tekanan Darah");
        }
      } catch (error) {
        showToast("Server tidak terjangkau", "trend", "error");
      }
    },
    [id_pasien],
  );

  const ambilTrend = async (id_kunjungan) => {
    if (!id_kunjungan) {
      setTrendBerat([]);
      setTrendFat([]);
      setTrendMuscle([]);
      setTrendTensi([]);
      return;
    }

    if (!id_pasien) {
      return;
    }

    if (pasienDetailStatus !== true) {
      return;
    }

    const emptyTrend = [];

    await Promise.all([
      ambilTrendBerat(emptyTrend, id_kunjungan),
      ambilTrendTensi(emptyTrend, id_kunjungan),
      ambilTrendfat(emptyTrend, id_kunjungan),
      ambilTrendmuscle(emptyTrend, id_kunjungan),
    ]);

    if (emptyTrend.length > 0) {
      const daftarTrend = emptyTrend.join(", ");

      showToast(
        `Data trend berikut belum tersedia: ${daftarTrend}`,
        "trend",
        "info",
      );
    }
  };

  return {
    trendBerat,
    trendFat,
    trendMuscle,
    trendTensi,
    openModal,
    setOpenModal,
    errors,
    setErrors,

    ambilTrend,
  };
};
