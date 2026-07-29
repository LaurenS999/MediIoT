import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User, Download, Pencil, Trash2 } from "lucide-react";
import "../../styles/pasienDetail.css";

import { usePasienDetail } from "../../hooks/usePasienDetail";

import { formatTanggalIndonesia } from "../../utils/formatTanggal";
import { Jenis_Kelamin } from "../../utils/jenisKelaminUtils";

import DetailPengukuran from "../../components/pasien/DetailPengukuran";

import GrafikTensi from "../../components/pasien/GrafikTensi";
import GrafikTrend from "../../components/pasien/GrafikTrend";

import { useTrend } from "../../hooks/useTrend";
import { transformTrendData } from "../../utils/formatTrend";
import { exportLaporanPasien } from "../../services/laporanService";
import { useAuth } from "../../context/AuthContext";

import { deletePasien, updatePasien } from "../../services/pasienService";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import ModalKonfirmasi from "../../components/common/ModalKonfirmasi";
import { formatDateTime } from "../../utils/formatDate";
import { useKunjunganDetail } from "../../hooks/useKunjunganDetail";

import { DetailPemeriksaanCard } from "../../components/pasien/DetailPemeriksaanCard";
import { renderAktivitasKunjungan } from "../../utils/renderAktivitasKunjungan";

import LampiranModal from "../../components/lampiranModal/LampiranModal";

export default function DetailPasienPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [errors, setErrors] = useState({});
  // =====================================================
  // ROUTER
  // =====================================================

  const { id } = useParams();

  const idPasien =
    user.role === "pasien" || user.role === "super admin" ? user.id_relasi : id;
  const is_Perawat = user.role === "perawat" || "super admin" ? true : false;

  // =====================================================
  // HOOKS
  // =====================================================

  const {
    pasienDetail,
    setPasienDetail,
    loadingPasien,
    loadingMeasurement,
    initialized,
    handleSelectSesiPengukuran,
    handleExportExcel,
    openDeleteModal,
    setOpenDeleteModal,
    pasienDetailStatus,
  } = usePasienDetail(idPasien, user?.id_user);

  const {
    trendBerat,
    trendFat,
    trendMucle,
    trendTensi,
    openModal,
    setOpenModal,

    interval,
    setInterval,
  } = useTrend(idPasien, pasienDetailStatus);

  const {
    kunjungan,
    daftarKunjungan,
    pengukuran,
    pemeriksaan,
    handleSelectKunjungan,
    loadingDaftarKunjungan,
    setLoadingDaftarKunjungan,
    measurementRef,
  } = useKunjunganDetail(pasienDetail?.id_pasien);

  const [isEditing, setIsEditing] = useState(false);

  const [showLampiranModal, setShowLampiranModal] = useState(false);

  const [selectedKunjungan, setSelectedKunjungan] = useState(null);

  const handleOpenLampiran = (kunjungan) => {
    setSelectedKunjungan(kunjungan);
    setShowLampiranModal(true);
  };

  useEffect(() => {
    if (pasienDetail) {
      setFormData({
        nama: pasienDetail.nama || "",
        jenis_kelamin: pasienDetail.jenis_kelamin || "",
        tanggal_lahir: pasienDetail.tanggal_lahir || "",
        tempat_lahir: pasienDetail.tempat_lahir || "",
        no_telp: pasienDetail.no_telp || "",
        email: pasienDetail.email || "",
        alamat: pasienDetail.alamat || "",
      });
    }
  }, [pasienDetail]);

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
      toast.warning(`Data tidak boleh ada yang kosong`);
      setErrors(newErrors);

      return false;
    }
    const namaLengkapRegex = /^[A-Za-zÀ-ÿ\s]+$/;

    if (!namaLengkapRegex.test(formData.nama)) {
      newErrors.nama = true;
      toast.warn("Nama Lengkap hanya boleh huruf dan spasi");
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleUbahPasien = async () => {
    // validateForm();

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

      toast.success(response.data?.message);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deletePasien(pasienDetail.id_pasien);

      toast.success(res.data?.message);
      navigate("/pasien");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message);
    }
  };

  if (!initialized) {
    return null;
  }
  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="detail-pasien-container">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="page-header">
        <div>
          <h1 className="page-title">Detail Pasien</h1>

          <p className="page-subtitle">
            Informasi detail pasien dan trend pengukuran
          </p>
        </div>
      </div>

      {/* =====================================================
          PATIENT CARD
      ===================================================== */}

      {pasienDetail ? (
        <div className="card-custom">
          {/* HEADER */}

          <div className="patient-card-header">
            <div className="patient-header-left">
              <div className="patient-avatar">
                <User size={34} />
              </div>

              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className={
                      errors.nama
                        ? "patient-input patient-name-input input-error"
                        : "patient-input patient-name-input"
                    }
                    required
                  />
                ) : (
                  <h2>{pasienDetail.nama}</h2>
                )}

                <p>{pasienDetail.kode_pasien}</p>
              </div>
            </div>

            {user.role !== "pasien" && (
              <div className="patient-header-actions">
                {isEditing ? (
                  <>
                    <button className="btn-edit" onClick={handleUbahPasien}>
                      Simpan
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => {
                        setFormData({
                          nama: pasienDetail.nama || "",
                          jenis_kelamin: pasienDetail.jenis_kelamin || "",
                          tanggal_lahir:
                            pasienDetail.tanggal_lahir.split("T")[0] || "",
                          tempat_lahir: pasienDetail.tempat_lahir || "",
                          no_telp: pasienDetail.no_telp || "",
                          email: pasienDetail.email || "",
                          alamat: pasienDetail.alamat || "",
                        });

                        setIsEditing(false);
                      }}
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setIsEditing(true);
                        setErrors([]);
                      }}
                    >
                      <Pencil size={16} />

                      <span>Edit</span>
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => setOpenDeleteModal(true)}
                    >
                      <Trash2 size={16} />

                      <span>Hapus</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* GRID */}

          <div className="patient-grid">
            <div className="patient-item">
              <div className="patient-label">Jenis Kelamin</div>

              <div className="patient-value">
                {isEditing ? (
                  <select
                    name="jenis_kelamin"
                    value={formData.jenis_kelamin}
                    onChange={handleChange}
                    className={
                      errors.jenis_kelamin
                        ? "patient-input input-error"
                        : "patient-input"
                    }
                  >
                    <option value="">Pilih</option>

                    <option value="L">Laki-laki</option>

                    <option value="P">Perempuan</option>
                  </select>
                ) : (
                  Jenis_Kelamin(pasienDetail.jenis_kelamin) || "-"
                )}
              </div>
            </div>

            <div className="patient-item">
              <div className="patient-label">Tanggal Lahir</div>

              <div className="patient-value">
                {isEditing ? (
                  <input
                    type="date"
                    name="tanggal_lahir"
                    // value="2026-07-27"
                    value={formData.tanggal_lahir.split("T")[0]}
                    onChange={handleChange}
                    className={
                      errors.tanggal_lahir
                        ? "patient-input input-error"
                        : "patient-input"
                    }
                  />
                ) : (
                  formatDateTime(pasienDetail.tanggal_lahir, false) || "-"
                )}
              </div>
            </div>

            <div className="patient-item">
              <div className="patient-label">Tempat Lahir</div>

              <div className="patient-value">
                {isEditing ? (
                  <input
                    type="text"
                    name="tempat_lahir"
                    value={formData.tempat_lahir}
                    onChange={handleChange}
                    className="patient-input"
                  />
                ) : (
                  pasienDetail.tempat_lahir || "-"
                )}
              </div>
            </div>

            <div className="patient-item">
              <div className="patient-label">No Telepon</div>

              <div className="patient-value">
                {isEditing ? (
                  <input
                    type="text"
                    name="no_telp"
                    value={formData.no_telp}
                    onChange={handleChange}
                    className="patient-input"
                  />
                ) : (
                  pasienDetail.no_telp || "-"
                )}
              </div>
            </div>

            <div className="patient-item">
              <div className="patient-label">Email</div>

              <div className="patient-value">
                {isEditing ? (
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="patient-input"
                  />
                ) : (
                  pasienDetail.email || "-"
                )}
              </div>
            </div>

            <div className="patient-item">
              <div className="patient-label">Tanggal Pendaftaran</div>

              <div className="patient-value">
                {formatDateTime(pasienDetail.tanggal_pendaftaran) || "-"}
              </div>
            </div>

            <div className="patient-item patient-wide">
              <div className="patient-label">Alamat</div>

              <div className="patient-value">
                {isEditing ? (
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    className={
                      errors.alamat
                        ? "patient-input input-error"
                        : "patient-input"
                    }
                  />
                ) : (
                  pasienDetail.alamat || "-"
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-custom">
          <div className="empty-table">Data pasien tidak ditemukan</div>
        </div>
      )}

      {/* DETAIL PEMERIKSAAN */}
      <div ref={measurementRef}>
        <DetailPemeriksaanCard pemeriksaan={pemeriksaan} />
      </div>
      {/* =====================================================
          DETAIL PENGUKURAN
      ===================================================== */}

      <div>
        <DetailPengukuran data={pengukuran} />
      </div>

      <div className="trend-section">
        <div className="trend-header">
          <div>
            <h3 className="trend-title">Grafik Data Pasien</h3>

            <p className="trend-subtitle">Grafik perubahan Data pasien</p>
          </div>

          <div className="trend-filter-group">
            <button
              className={`trend-filter-btn ${interval === 7 ? "active" : ""}`}
              onClick={() => setInterval(7)}
            >
              7 Hari
            </button>

            <button
              className={`trend-filter-btn ${interval === 30 ? "active" : ""}`}
              onClick={() => setInterval(30)}
            >
              30 Hari
            </button>

            <button
              className={`trend-filter-btn ${interval === 90 ? "active" : ""}`}
              onClick={() => setInterval(90)}
            >
              3 Bulan
            </button>
          </div>
        </div>

        <div className="trend-grid">
          <GrafikTrend
            title="Trend Berat Badan"
            data={transformTrendData(trendBerat, ["berat"])}
            dataKey="berat"
            color="#2563eb"
            unit="kg"
          />

          <GrafikTensi
            title="Trend Tekanan Darah"
            data={transformTrendData(trendTensi, ["systolic", "diastolic"])}
          />

          <GrafikTrend
            title="Trend Body Fat"
            data={transformTrendData(trendFat, ["body_fat"])}
            dataKey="body_fat"
            color="#dc2626"
            unit="%"
          />

          <GrafikTrend
            title="Trend Muscle Mass"
            data={transformTrendData(trendMucle, ["muscle_mass"])}
            dataKey="muscle_mass"
            color="#16a34a"
            unit="kg"
          />
        </div>
      </div>

      {/* =====================================================
          RIWAYAT PENGUKURAN
      ===================================================== */}

      <div className="card-custom">
        <div className="card-header-flex">
          <div>
            <div className="label-header">Riwayat Kunjungan</div>

            <div className="page-subtitle">Riwayat Kunjungan pasien</div>
          </div>

          <button className="export-btn" onClick={handleExportExcel}>
            <Download size={18} />
            Export Excel
          </button>
        </div>

        <div className="table-wrapper-modern">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Nama Perawat</th>
                <th>Nama Dokter</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loadingDaftarKunjungan ? (
                <tr>
                  <td colSpan="4" className="empty-table">
                    Loading riwayat daftar Kunjungan...
                  </td>
                </tr>
              ) : daftarKunjungan.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-table">
                    Belum ada riwayat Kunjungan
                  </td>
                </tr>
              ) : (
                daftarKunjungan.map((item, index) => (
                  <tr key={index} className="modern-row">
                    <td>{formatDateTime(item.tanggal_kunjungan)}</td>

                    <td>
                      <span className="patient-name-text">
                        {item.nama_perawat}
                      </span>
                    </td>

                    <td>
                      <span className="patient-name-text">
                        {item.nama_dokter || "-"}
                      </span>
                    </td>
                    <td>
                      <div className="action-button-group">
                        <button
                          className="btn-primary"
                          onClick={() =>
                            handleSelectKunjungan(
                              pasienDetail.id_pasien,
                              item.id_pemeriksaan,
                              item.id_pengukuran,
                            )
                          }
                        >
                          Lihat Data
                        </button>

                        {is_Perawat == true && (
                          <button
                            className="btn-primary"
                            onClick={() => handleOpenLampiran(item)}
                          >
                            Lampiran
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalKonfirmasi
        open={openDeleteModal}
        title="Hapus User"
        message={`Apakah anda yakin ingin menghapus user ${pasienDetail?.nama}?`}
        confirmText="Hapus"
        cancelText="Batal"
        type="warning"
        onConfirm={handleDelete}
        onCancel={() => setOpenDeleteModal(false)}
      />

      <LampiranModal
        show={showLampiranModal}
        onClose={() => {
          setShowLampiranModal(false);
          setSelectedKunjungan(null);
        }}
        idKunjungan={selectedKunjungan?.id_kunjungan}
      />
    </div>
  );
}
