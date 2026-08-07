import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User, Download, Pencil, Trash2 } from "lucide-react";
import "../../styles/pasienDetail.css";

import { usePasienDetail } from "../../hooks/usePasienDetail";

import { Jenis_Kelamin } from "../../utils/jenisKelaminUtils";

import DetailPengukuran from "../../components/pasien/DetailPengukuran";

import { useTrend } from "../../hooks/useTrend";
import { useAuth } from "../../context/AuthContext";

import ModalKonfirmasi from "../../components/common/ModalKonfirmasi";
import { formatDateTime } from "../../utils/formatDate";
import { useKunjunganDetail } from "../../hooks/useKunjunganDetail";

import { DetailPemeriksaanCard } from "../../components/pasien/DetailPemeriksaanCard";
import { renderAktivitasKunjungan } from "../../utils/renderAktivitasKunjungan";
import { GrafikTrendCard } from "../../components/pasien/GrafikTrendCard";

import Lampiran from "../../components/lampiran/Lampiran";
import useLampiran from "../../hooks/useLampiran";

import Pagination from "../../components/common/Pagination";
import { getPaginationItems } from "../../utils/pagination";

import { useKunjunganDropdown } from "../../hooks/useKunjunganDropdown";

export default function DetailPasienPage() {
  const { user } = useAuth();

  // =====================================================
  // ROUTER
  // =====================================================

  const { id } = useParams();

  const idPasien = user.role === "pasien" ? user.id_relasi : id;
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

    formData,
    setFormData,
    handleUbahPasien,
    handleDelete,
    handleChange,
    errors,
    setErrors,
    isEditing,
    setIsEditing,
  } = usePasienDetail(idPasien, user?.id_user);

  const {
    trendBerat,
    trendFat,
    trendMuscle,
    trendTensi,
    openModal,
    setOpenModal,

    ambilTrend,
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
    currentPage,
    setCurrentPage,
    limitPage,
    totalPage,
  } = useKunjunganDetail(idPasien);

  const { kunjunganDropdown, ambilKunjunganDropdown } = useKunjunganDropdown();

  const [selectedKunjungan, setSelectedKunjungan] = useState("");
  const [activeTab, setActiveTab] = useState("pemeriksaan");

  const { lampiran, previewImage, setPreviewImage } =
    useLampiran(selectedKunjungan);

  useEffect(() => {
    if (idPasien) {
      ambilKunjunganDropdown(idPasien);
    }
  }, []);

  const page = getPaginationItems(currentPage, totalPage);

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

  if (!initialized) {
    return null;
  }
  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="page-container">
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

      <div className="kunjungan-selector">
        <div className="kunjungan-selector-info">
          <h3>Pilih Kunjungan</h3>
          <p>
            Pilih tanggal kunjungan untuk melihat hasil pemeriksaan dan
            pengukuran pasien.
          </p>
        </div>

        <select
          className="kunjungan-select"
          value={selectedKunjungan}
          onChange={(e) => {
            setSelectedKunjungan(e.target.value);
            handleSelectKunjungan(pasienDetail.id_pasien, e.target.value);
            ambilTrend(e.target.value);
          }}
        >
          <option value="">Pilih tanggal kunjungan</option>

          {kunjunganDropdown.map((item) => (
            <option key={item.id_kunjungan} value={item.id_kunjungan}>
              {formatDateTime(item.tanggal_pemeriksaan_awal, true)}
            </option>
          ))}
        </select>
      </div>

      <div className="detail-tabs">
        <button
          type="button"
          className={`detail-tab ${
            activeTab === "pemeriksaan" ? "active" : ""
          }`}
          onClick={() => setActiveTab("pemeriksaan")}
        >
          Pemeriksaan
        </button>

        <button
          type="button"
          className={`detail-tab ${activeTab === "pengukuran" ? "active" : ""}`}
          onClick={() => setActiveTab("pengukuran")}
        >
          Pengukuran
        </button>

        <button
          type="button"
          className={`detail-tab ${activeTab === "lampiran" ? "active" : ""}`}
          onClick={() => setActiveTab("lampiran")}
        >
          Lampiran
        </button>

        <button
          type="button"
          className={`detail-tab ${activeTab === "trend" ? "active" : ""}`}
          onClick={() => setActiveTab("trend")}
        >
          Trend
        </button>

        <button
          type="button"
          className={`detail-tab ${activeTab === "riwayat_kunjungan" ? "active" : ""}`}
          onClick={() => setActiveTab("riwayat_kunjungan")}
        >
          Riwayat Kunjungan
        </button>
      </div>

      <div className="detail-tab-content">
        {activeTab === "pemeriksaan" && (
          <div className="tab-panel">
            <DetailPemeriksaanCard
              pemeriksaan={pemeriksaan}
              kunjungan={kunjungan}
            />
          </div>
        )}

        {activeTab === "pengukuran" && (
          <div className="tab-panel">
            <DetailPengukuran data={pengukuran} />
          </div>
        )}

        {activeTab === "lampiran" && (
          <div className="tab-panel">
            <div className="card-custom ">
              <Lampiran files={lampiran} canAdd={false} canDelete={false} />
            </div>
          </div>
        )}

        {activeTab === "trend" && (
          <div className="tab-panel">
            <GrafikTrendCard
              trendBerat={trendBerat}
              trendFat={trendFat}
              trendMucle={trendMuscle}
              trendTensi={trendTensi}
            />
          </div>
        )}

        {activeTab === "riwayat_kunjungan" && (
          <div className="tab-panel">
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
                      <th>No</th>
                      <th>Tanggal Pemeriksaan Awal</th>
                      <th>Nama Perawat</th>
                      <th>Tanggal Pemeriksaan Dokter</th>
                      <th>Nama Dokter</th>
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
                          <td>{index + 1}</td>

                          <td>
                            {formatDateTime(item.tanggal_pemeriksaan_awal)}
                          </td>

                          <td>
                            <span className="patient-name-text">
                              {item.nama_perawat}
                            </span>
                          </td>
                          <td>
                            {formatDateTime(item.tanggal_pemeriksaan_dokter)}
                          </td>

                          <td>
                            <span className="patient-name-text">
                              {item.nama_dokter || "-"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
                pages={page}
                totalPages={totalPage}
              />
            </div>
          </div>
        )}
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
    </div>
  );
}
