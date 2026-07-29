import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";

import { useModalInfo } from "../context/ModalInfoProvider.js";
import {
  getPendaftaran,
  getPendaftaranPasien,
  postPendaftaran,
  patchPendaftaranTolak,
  patchPendaftaranBatal,
  patchPendaftaranSetuju,
} from "../services/permintaanPemeriksaanService.js";
import { useAuth } from "../context/AuthContext.js";

export const usePermintaanPemeriksaan = (id_user) => {
  const { user } = useAuth();
  const [pendaftaran, setPendaftaran] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    tanggal_pemeriksaan: "",
    keluhan: "",
    jam_pemeriksaan: "",
  });

  const [modal, setModal] = useState({
    open: false,
    action: "",
    data: null,
  });

  const [alasan, setAlasan] = useState("");

  const handleOpenModal = (action, data) => {
    setAlasan("");

    setModal({
      open: true,
      action,
      data,
    });
  };

  const handleCloseModal = () => {
    setAlasan("");

    setModal({
      open: false,
      action: "",
      data: null,
    });
  };

  const validasi = () => {
    const newErrors = {};
    console.log("MASUK VALIDASI");

    if (!form.tanggal_pemeriksaan) {
      newErrors.tanggal_pemeriksaan = true;
    }

    if (!form.keluhan) {
      newErrors.keluhan = true;
    }

    if (!form.jam_pemeriksaan) {
      newErrors.jam_pemeriksaan = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.warning("Data wajib tidak boleh kosong", {
        toastId: "permintaan-validasi-error",
      });
      return false;
    }

    if (form.tanggal_pemeriksaan) {
      const selectedDate = new Date(form.tanggal_pemeriksaan);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.tanggal_pemeriksaan = true;

        toast.warning("Tanggal pemeriksaan tidak boleh sebelum hari ini.");

        setErrors(newErrors);
        return false;
      }
    }

    return true;
  };

  const validasiAlasan = () => {
    const newErrors = {};

    if (!alasan) {
      newErrors.alasan = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.warning("Alasan tidak boleh kosong");
      return false;
    }

    return true;
  };

  const ambilpendaftaranByPasien = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPendaftaranPasien(user.id_relasi);
      const pendaftaranList = res.data.data;

      if (Array.isArray(pendaftaranList)) {
        if (pendaftaranList.length >= 1) {
          setPendaftaran(pendaftaranList);
        } else {
          toast.info(res.data?.message);
          setPendaftaran([]);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data pendaftaran",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const ambilpendaftaran = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPendaftaran();
      const pendaftaranList = res.data.data;

      if (Array.isArray(pendaftaranList)) {
        if (pendaftaranList.length >= 1) {
          setPendaftaran(pendaftaranList);
        } else {
          toast.info(res.data?.message);
          setPendaftaran([]);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data pendaftaran",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTambahPendaftaran = useCallback(async () => {
    if (!validasi()) return;
    setLoading(true);
    try {
      const response = await postPendaftaran(form);

      setForm({
        tanggal_pemeriksaan: "",
        keluhan: "",
        jam_pemeriksaan: "",
      });
      ambilpendaftaranByPasien();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data Pendaftaran",
        {
          toastId: "permintaan-create-error",
        },
      );
    } finally {
      setLoading(false);
    }
  });

  const handleConfirm = async () => {
    setLoading(true);
    try {
      switch (modal.action) {
        case "tolak":
          if (!validasiAlasan()) return;
          await patchPendaftaranTolak(
            modal.data.id_permintaan_pemeriksaan,
            alasan,
          );
          break;

        case "batal":
          if (!validasiAlasan()) return;
          await patchPendaftaranBatal(
            modal.data.id_permintaan_pemeriksaan,
            alasan,
          );
          break;

        case "setuju":
          await patchPendaftaranSetuju(modal.data.id_permintaan_pemeriksaan);
          break;

        default:
          return;
      }

      handleCloseModal();

      // refresh data
      if (user.role == "pasien") {
        ambilpendaftaranByPasien();
      } else {
        ambilpendaftaran();
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.role == "pasien") {
      ambilpendaftaranByPasien();
    } else {
      ambilpendaftaran();
    }
  }, []);

  return {
    pendaftaran,
    form,
    setForm,
    modal,
    setModal,
    alasan,
    setAlasan,
    handleOpenModal,
    handleCloseModal,
    handleTambahPendaftaran,
    handleConfirm,

    errors,
    setErrors,
    loading,
  };
};
