import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useModalInfo } from "../context/ModalInfoProvider.js";
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

  const [interval, setInterval] = useState(7);

  const [openModal, setOpenModal] = useState(false);
  const [errors, setErrors] = useState({});

  const emptyTrend = [];

  const ambilTrendBerat = useCallback(
    async (emptyTrend) => {
      try {
        const res = await getTrendBerat(id_pasien, interval);
        const listBerat = res.data.data;
        if (Array.isArray(listBerat)) {
          if (listBerat.length >= 1) {
            setTrendBerat(listBerat);
          } else {
            setTrendBerat([]);
            emptyTrend.push("Berat Badan");
          }
        }
      } catch (error) {
        toast.error("Server tidak terjangkau", {
          toastId: "trend-berat-server-error",
        });
      }
    },
    [id_pasien, interval],
  );

  const ambilTrendfat = useCallback(
    async (emptyTrend) => {
      try {
        const res = await getTrendFat(id_pasien, interval);
        const listfat = res.data.data;

        if (Array.isArray(listfat)) {
          if (listfat.length >= 1) {
            setTrendFat(listfat);
          } else {
            setTrendFat([]);
            emptyTrend.push("Body Fat");
          }
        }
      } catch (error) {
        toast.error("Server tidak terjangkau", {
          toastId: "trend-fat-server-error",
        });
      }
    },
    [id_pasien, interval],
  );

  const ambilTrendmuscle = useCallback(
    async (emptyTrend) => {
      try {
        const res = await getTrendMuscle(id_pasien, interval);
        const listMuscle = res.data.data;

        if (Array.isArray(listMuscle)) {
          if (listMuscle.length >= 1) {
            setTrendMuscle(listMuscle);
          } else {
            setTrendMuscle([]);
            emptyTrend.push("Muscle Mass");
          }
        }
      } catch (error) {
        toast.error("Server tidak terjangkau", {
          toastId: "trend-muscle-server-error",
        });
      }
    },
    [id_pasien, interval],
  );

  const ambilTrendTensi = useCallback(
    async (emptyTrend) => {
      try {
        const res = await getTrendTensi(id_pasien, interval);
        const listTensi = res.data.data;

        if (Array.isArray(listTensi)) {
          if (listTensi.length >= 1) {
            setTrendTensi(listTensi);
          } else {
            setTrendTensi([]);
            emptyTrend.push("Tekanan Darah");
          }
        }
      } catch (error) {
        toast.error("Server tidak terjangkau", {
          toastId: "trend-tensi-server-error",
        });
      }
    },
    [id_pasien, interval],
  );

  useEffect(() => {
    if (pasienDetailStatus == true) {
      const loadTrend = async () => {
        const emptyTrend = [];

        await Promise.all([
          ambilTrendBerat(emptyTrend),
          ambilTrendTensi(emptyTrend),
          ambilTrendfat(emptyTrend),
          ambilTrendmuscle(emptyTrend),
        ]);

        if (emptyTrend.length > 0) {
          toast.info(
            `Pasien belum mempunyai data trend dalam interval ${interval}: ${emptyTrend.join(", ")}`,
            {
              toastId: "trend-kosong",
            },
          );
        }
      };

      loadTrend();
    }
  }, [id_pasien, pasienDetailStatus, interval]);

  return {
    trendBerat,
    trendFat,
    trendMuscle,
    trendTensi,
    openModal,
    setOpenModal,
    errors,
    setErrors,
    interval,
    setInterval,

    ambilTrendBerat,
    ambilTrendTensi,
    ambilTrendfat,
    ambilTrendmuscle,
  };
};
