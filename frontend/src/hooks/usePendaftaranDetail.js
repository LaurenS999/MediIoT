import { useEffect, useState, useCallback } from "react";

import { getDetailPasien } from "../services/pasienService.js";

import { exportLaporanPasien } from "../services/laporanService.js";
import { getPendaftaranDetail } from "../services/pendaftaranService.js";
import { showToast } from "../utils/showToast.js";

export const usePendaftaranDetail = (id_pendaftaran, setKeluhan) => {
  const [pendaftaranDetail, setPendaftaranDetail] = useState(null);
  const [loadingPendaftaran, setLoadingPendaftaran] = useState(false);

  const ambilDataPendaftaran = useCallback(async () => {
    try {
      setLoadingPendaftaran(true);

      const res = await getPendaftaranDetail(id_pendaftaran);
      const data = res.data.data[0];
      setPendaftaranDetail(data);
      setKeluhan(data.keluhan);
    } catch (error) {
      console.error(error);
      showToast("Internal Server Error", "Pendaftaran-detail", "error");
    } finally {
      setLoadingPendaftaran(false);
    }
  }, [id_pendaftaran]);

  useEffect(() => {
    if (id_pendaftaran) {
      ambilDataPendaftaran();
    }
  }, [id_pendaftaran]);

  return { pendaftaranDetail, setPendaftaranDetail, loadingPendaftaran };
};
