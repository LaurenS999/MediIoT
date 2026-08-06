import { useEffect, useState, useCallback, useRef } from "react";

import { getDetailPasien } from "../services/pasienService.js";

import { exportLaporanPasien } from "../services/laporanService.js";
import { showToast } from "../utils/showToast.js";
import { deletePasien, updatePasien } from "../services/pasienService.js";
import { useNavigate } from "react-router-dom";

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
      setPasienDetailStatus(true);

      setPasienDetail(data || null);
    } catch (error) {
      if (error.response.status === 404) {
        showToast(error.response?.data?.message, "pasien-detail", "error");
      } else {
        console.error(error);
        showToast(
          error.response?.data?.message || "Internal Server Error",
          "pasien-detail",
          "error",
        );
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
      showToast(error.response?.data?.message, "pasien-detail", "error");
    }
  };

  useEffect(() => {
    if (id_pasien) {
      ambilDetailPasien();
    }
  }, [id_pasien]);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    jenis_kelamin: "",
    tanggal_lahir: "",
    tempat_lahir: "",
    no_telp: "",
    email: "",
    alamat: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = true;
    }

    if (!formData.jenis_kelamin) {
      newErrors.jenis_kelamin = true;
    }

    if (!formData.tanggal_lahir) {
      newErrors.tanggal_lahir = true;
    }

    if (!formData.alamat) {
      newErrors.alamat = true;
    }

    if (Object.keys(newErrors).length > 0) {
      showToast("Data tidak boleh ada yang kosong", "pasien-detail", "warning");
      setErrors(newErrors);

      return false;
    }
    const namaLengkapRegex = /^[A-Za-zÀ-ÿ\s]+$/;

    if (!namaLengkapRegex.test(formData.nama)) {
      newErrors.nama = true;

      showToast(
        "Nama Lengkap hanya boleh huruf dan spasi",
        "pasien-detail",
        "warning",
      );
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleUbahPasien = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoadingUpdate(true);

      const response = await updatePasien(pasienDetail.id_pasien, formData);

      // update local state
      setPasienDetail((prev) => ({
        ...prev,
        ...formData,
      }));

      setIsEditing(false);

      showToast(response.data.message, "pasien-detail", "success");
    } catch (error) {
      console.error(error);

      showToast(error.response?.data?.message, "pasien-detail", "error");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deletePasien(pasienDetail.id_pasien);

      showToast(res.data?.message, "pasien-detail");
      navigate("/pasien");
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message, "pasien-detail", "error");
    }
  };

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

    formData,
    setFormData,
    handleUbahPasien,
    handleDelete,
    handleChange,
    errors,
    setErrors,
    isEditing,
    setIsEditing,
  };
};
