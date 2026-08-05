import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";

import { useModalInfo } from "../context/ModalInfoProvider.js";
import {
  getPermintaan,
  getPermintaanPasien,
  postPermintaan,
  patchPermintaanBatal,
  patchPermintaanSelesai,
} from "../services/permintaanPemeriksaanService.js";
import { useAuth } from "../context/AuthContext.js";

export const usePermintaanPemeriksaan = (id_user) => {
  const { user } = useAuth();
  const [permintaan, setPermintaan] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPage, setLimitPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [form, setForm] = useState({
    tanggal_pemeriksaan: "",
    keluhan: "",
  });

  const [formSelesai, setFormSelesai] = useState({
    waktu_kunjungan_awal: "",
    waktu_kunjungan_akhir: "",
  });

  const [selectedPermintaan, setSelectedPermintaan] = useState(null);

  const [modal, setModal] = useState({
    open: false,
    action: "",
    data: null,
  });

  const [alasan, setAlasan] = useState("");

  const handleOpenModal = (action, data) => {
    setAlasan("");
    setSelectedPermintaan(data);

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

  const validasiWaktuKunjung = () => {
    const newErrors = {};

    const waktuAwal = formSelesai.waktu_kunjungan_awal;
    const waktuAkhir = formSelesai.waktu_kunjungan_akhir;

    // Konversi HH:mm menjadi menit
    const waktuKeMenit = (waktu) => {
      const [jam, menit] = waktu.split(":").map(Number);
      return jam * 60 + menit;
    };

    const batasWaktuAwal = 8 * 60; // 08:00
    const batasWaktuAkhir = 17 * 60; // 17:00

    // Validasi waktu kosong
    if (!waktuAwal) {
      newErrors.waktu_kunjungan_awal = true;
    }

    if (!waktuAkhir) {
      newErrors.waktu_kunjungan_akhir = true;
    }

    // Lanjut validasi jika keduanya sudah diisi
    if (waktuAwal && waktuAkhir) {
      const totalMenitAwal = waktuKeMenit(waktuAwal);
      const totalMenitAkhir = waktuKeMenit(waktuAkhir);

      // Validasi jam operasional
      if (totalMenitAwal < batasWaktuAwal || totalMenitAwal > batasWaktuAkhir) {
        newErrors.waktu_kunjungan_awal = true;

        toast.warning(
          "Waktu kunjungan awal harus berada antara 08:00 sampai 17:00.",
        );
      }

      if (
        totalMenitAkhir < batasWaktuAwal ||
        totalMenitAkhir > batasWaktuAkhir
      ) {
        newErrors.waktu_kunjungan_akhir = true;

        toast.warning(
          "Waktu kunjungan akhir harus berada antara 08:00 sampai 17:00.",
        );
      }

      // Waktu akhir harus lebih besar dari waktu awal
      if (totalMenitAkhir <= totalMenitAwal) {
        newErrors.waktu_kunjungan_akhir = true;

        toast.warning(
          "Waktu kunjungan akhir harus lebih besar dari waktu kunjungan awal.",
        );
      }
    }

    setErrors(newErrors);

    // Validasi waktu kosong
    if (!waktuAwal || !waktuAkhir) {
      toast.warning("Waktu kunjungan tidak boleh kosong");
      return false;
    }

    return Object.keys(newErrors).length === 0;
  };

  const ambilPermintaanByPasien = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await getPermintaanPasien(user.id_relasi, page, limit);
      const permintaanList = res.data.data;
      console.log("RESPON :, ", res);

      if (Array.isArray(permintaanList)) {
        if (permintaanList.length >= 1) {
          setPermintaan(permintaanList);

          setCurrentPage(res.data.pagination.page);
          setTotalPage(res.data.pagination.totalPage);
        } else {
          toast.info(res.data?.message);
          setPermintaan([]);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data Permintaan",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const ambilPermintaan = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await getPermintaan(page, limit);
      const permintaanList = res.data.data;
      console.log("RESPONSE : ", res);

      if (Array.isArray(permintaanList)) {
        if (permintaanList.length >= 1) {
          setPermintaan(permintaanList);

          setCurrentPage(res.data.pagination.page);
          setTotalPage(res.data.pagination.totalPage);
        } else {
          toast.info(res.data?.message);
          setPermintaan([]);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data permintaan",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTambahPermintaan = useCallback(async () => {
    if (!validasi()) return;
    setLoading(true);
    try {
      const response = await postPermintaan(form);

      setForm({
        tanggal_pemeriksaan: "",
        keluhan: "",
      });

      if (user.role == "super admin") {
        ambilPermintaan();
      } else {
        ambilPermintaanByPasien();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data Permintaan",
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
        case "batal":
          if (!validasiAlasan()) return;
          await patchPermintaanBatal(
            modal.data.id_permintaan_pemeriksaan,
            alasan,
          );
          break;

        case "selesai":
          if (!validasiWaktuKunjung()) return;
          await patchPermintaanSelesai(
            formSelesai,
            modal.data.id_permintaan_pemeriksaan,
          );
          break;

        default:
          return;
      }

      handleCloseModal();

      setCurrentPage(1);

      // refresh data
      if (user.role == "pasien") {
        ambilPermintaanByPasien();
      } else {
        ambilPermintaan();
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.role == "pasien") {
      ambilPermintaanByPasien(currentPage, limitPage);
    } else {
      ambilPermintaan(currentPage, limitPage);
    }
  }, [currentPage]);

  return {
    permintaan,
    form,
    setForm,
    modal,
    setModal,
    alasan,
    setAlasan,
    handleOpenModal,
    handleCloseModal,
    handleTambahPermintaan,
    handleConfirm,

    formSelesai,
    setFormSelesai,

    errors,
    setErrors,
    loading,

    currentPage,
    setCurrentPage,
    limitPage,
    totalPage,

    selectedPermintaan,
    setSelectedPermintaan,
  };
};
