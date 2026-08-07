import { useEffect, useState, useCallback, useRef } from "react";

import { getDetailPasien } from "../services/pasienService.js";

import { exportLaporanPasien } from "../services/laporanService.js";
import { showToast } from "../utils/showToast.js";
import { getpemeriksaanpasien } from "../services/pemeriksaanService.js";
import { useNavigate } from "react-router-dom";

export const usePemeriksaanPasien = (id_pasien) => {
  const [pasienDetail, setPasienDetail] = useState(null);
  const [permintaanPemeriksaanAktif, setPermintaanPemeriksaanAktif] =
    useState(false);

  const ambilDetailPasien = useCallback(async () => {
    console.log("RESPON : ");

    try {
      const res = await getpemeriksaanpasien(id_pasien);
      console.log("RESPON : ", res.data);

      const data = res.data.data.pasien;
      setPasienDetail(data || null);
      setPermintaanPemeriksaanAktif(res.data.data.permintaanPemeriksaanAktif);
    } catch (error) {
      if (error.response.status === 404) {
        showToast(error.response?.data?.message, "pemeriksaan-awal", "error");
      } else {
        console.error(error);
        showToast(
          error.response?.data?.message || "Internal Server Error",
          "pemeriksaan-awal",
          "error",
        );
      }
    }
  });

  useEffect(() => {
    if (id_pasien) {
      ambilDetailPasien();
    }
  }, [id_pasien]);

  return {
    pasienDetail,
    setPasienDetail,
    permintaanPemeriksaanAktif,
  };
};
