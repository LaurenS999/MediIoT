import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";

import { useModalInfo } from "../context/ModalInfoProvider.js";
import {
  getPendaftaran,
  getPendaftaranPasien,
  postPendaftaran,
  patchPendaftaranSetuju,
  patchPendaftaranTolak,
  patchPendaftaranBatal,
  patchPendaftaranCheckin,
} from "../services/pendaftaranService.js";
import { useAuth } from "../context/AuthContext.js";

export const usePendaftaran = (id_user) => {
  const { user } = useAuth();
  const [pendaftaran, setPendaftaran] = useState([]);

  const [form, setForm] = useState({
    tanggal_pemeriksaan: "",
    keluhan: "",
  });

  const [modal, setModal] = useState({
    open: false,
    action: "",
    data: null,
  });

  const [reason, setReason] = useState("");

  const handleOpenModal = (action, data) => {
    setReason("");

    setModal({
      open: true,
      action,
      data,
    });
  };

  const handleCloseModal = () => {
    setReason("");

    setModal({
      open: false,
      action: "",
      data: null,
    });
  };

  const ambilpendaftaranByPasien = useCallback(async () => {
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
    }
  }, []);

  const ambilpendaftaran = useCallback(async () => {
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
    }
  }, []);

  const handleTambahPendaftaran = useCallback(async () => {
    try {
      const response = await postPendaftaran(form);

      setForm({
        tanggal_pemeriksaan: "",
        keluhan: "",
      });
      ambilpendaftaranByPasien();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data Pendaftaran",
      );
    }
  });

  const handleConfirm = async () => {
    try {
      switch (modal.action) {
        case "setuju":
          await patchPendaftaranSetuju(modal.data.id_pendaftaran);
          break;

        case "tolak":
          await patchPendaftaranTolak(modal.data.id_pendaftaran, reason);
          break;

        case "batal":
          await patchPendaftaranBatal(modal.data.id_pendaftaran, reason);
          break;

        case "check_in":
          await patchPendaftaranCheckin(modal.data.id_pendaftaran);
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
    reason,
    setReason,
    handleOpenModal,
    handleCloseModal,
    handleTambahPendaftaran,
    handleConfirm,
  };
};
