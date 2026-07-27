import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import {
  createPasien,
  getPasien,
  deletePasien,
  updatePasien,
} from "../services/pasienService.js";

import { useModalInfo } from "../context/ModalInfoProvider.js";

export const usePasien = (id_user) => {
  const [pasien, setPasien] = useState([]);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [pasienDetail, setPasienDetail] = useState([]);
  const [errors, setErrors] = useState({});

  const { showModal } = useModalInfo();

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPage, setLimitPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [newPasien, setNewPasien] = useState({
    nama: "",
    alamat: "",
    tanggal_lahir: "",
    tempat_lahir: "",
    jenis_kelamin: "",
    email: "",
    no_telp: "",
    id_user: id_user,
  });

  const [editPatient, setEditPatient] = useState({
    editNama: "",
    editAlamat: "",
    editTanggalLahir: "",
    editTempatLahir: "",
    editJenisKelamin: "",
    editEmail: "",
    editNoTelp: "",
    id_user: id_user,
  });

  const ambilPasien = useCallback(
    async (page = 1) => {
      try {
        const res = await getPasien(search, page, limitPage);
        const pasienList = res.data.data;
        const paginationData = res.data.pagination;

        if (Array.isArray(pasienList)) {
          if (pasienList.length >= 1) {
            setPasien(pasienList);
            setCurrentPage(paginationData.page);
            setTotalPage(paginationData.totalPage);
          } else {
            toast.info("Pasien Tidak ditemukan");
            setPasien([]);
          }
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Terjadi kesalahan saat mengambil data pasien",
        );
      }
    },
    [search],
  );

  const ambilDetailPasien = useCallback(async () => {
    try {
    } catch (error) {
      toast.info("Terjadi Error : ", error);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const namaLengkapRegex = /^[A-Za-zÀ-ÿ\s]+$/;

    if (!newPasien.nama.trim()) {
      newErrors.nama = true;
    } else if (!namaLengkapRegex.test(newPasien.nama)) {
      newErrors.nama = true;
    }

    if (!newPasien.jenis_kelamin) {
      newErrors.jenis_kelamin = true;
    }

    if (!newPasien.tanggal_lahir) {
      newErrors.tanggal_lahir = true;
    }

    if (!newPasien.alamat) {
      newErrors.alamat = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.warning("Data wajib tidak boleh kosong");
      return false;
    }

    return true;
  };

  const handleTambahPasien = useCallback(async () => {
    if (!validateForm()) return;
    // console.log(id_user);
    try {
      const response = await createPasien({
        nama: newPasien.nama,
        alamat: newPasien.alamat,
        tanggal_lahir: newPasien.tanggal_lahir,
        tempat_lahir: newPasien.tempat_lahir,
        jenis_kelamin: newPasien.jenis_kelamin,
        email: newPasien.email,
        no_telp: newPasien.no_telp,
        id_user: id_user,
      });

      toast.success(response.data.message);

      setNewPasien({
        nama: "",
        alamat: "",
        tanggal_lahir: "",
        tempat_lahir: "",
        jenis_kelamin: "",
        email: "",
        no_telp: "",
      });

      ambilPasien();
      setOpenModal(false);
    } catch (error) {
      console.log("ERROR : ", error.response);

      if (error.response?.status === 401) {
        if (error.response?.status === 401) {
          setErrors((prev) => ({
            ...prev,
            nama: true,
          }));
        }
      }
      toast.error(error.response?.data?.message);
    }
  });

  const openDetailPatientModal = (patient) => {
    setShowDetailModal(true);
    //set data textbox default Value
    setEditPatient({
      editNik: patient.nik,
      editName: patient.name,
      editAddress: patient.address,
      editGender: patient.gender,
      editPatientNumber: patient.patient_number,
      editEmail: patient.email,
      editPhone: patient.phone,
      editFirstRegistrationDate: patient.first_registration_date,
      editInsuranceType: patient.insurance_type,
    });
  };

  useEffect(() => {
    ambilPasien(currentPage);
  }, [search, currentPage]);

  return {
    pasien,
    setPasien,
    setLimitPage,
    search,
    setSearch,

    newPasien,
    setNewPasien,
    openModal,
    setOpenModal,
    handleTambahPasien,

    errors,
    setErrors,

    currentPage,
    setCurrentPage,
    totalPage,
  };
};
