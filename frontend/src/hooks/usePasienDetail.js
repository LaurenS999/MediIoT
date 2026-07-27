import { useEffect, useState, useCallback, useRef } from "react";

import { toast } from "react-toastify";

import { getDetailPasien } from "../services/pasienService.js";

import { exportLaporanPasien } from "../services/laporanService.js";

export const usePasienDetail = (id_pasien, id_user) => {
  const [pasienDetail, setPasienDetail] = useState(null);
  const [pasienDetailStatus, setPasienDetailStatus] = useState(false);
  const [measurementData, setMeasurementData] = useState(null);
  const [loadingPasien, setLoadingPasien] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [loadingMeasurement, setLoadingMeasurement] = useState(true);
  const measurementRef = useRef(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const ambilDetailPasien = useCallback(async () => {
    try {
      setLoadingPasien(true);

      const res = await getDetailPasien(id_pasien);

      const data = res.data.data.pasien;
      console.log("DATA DARI BACKEND : ", data);
      setPasienDetailStatus(true);

      setPasienDetail(data || null);
    } catch (error) {
      if (error.response.status === 404) {
        toast.error(error.response.data.message, {
          toastId: "pasien-detail-tidak-ditemukan",
        });
      } else {
        console.error(error);
        toast.error("Internal Server Error", {
          toastId: "pasien-detail-server-error",
        });
      }
    } finally {
      setLoadingPasien(false);
      setInitialized(true);
    }
  }, [id_pasien]);

  const handleExportExcel = async () => {
    try {
      const response = await exportLaporanPasien(id_pasien, id_user);

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `laporan-pengukuran-${id_pasien}.xlsx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Internal Server Error");
    }
  };

  useEffect(() => {
    if (id_pasien) {
      ambilDetailPasien();
    }
  }, [id_pasien]);

  return {
    pasienDetail,
    setPasienDetail,
    measurementData,
    loadingPasien,
    loadingMeasurement,
    initialized,
    measurementRef,
    handleExportExcel,
    openDeleteModal,
    setOpenDeleteModal,
    pasienDetailStatus,
  };
};
