import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import "../../styles/pasien.css";
import "../../styles/permintaan.css";

import { usePermintaanPemeriksaan } from "../../hooks/usePermintaanPemeriksaan";
import { formatDateTime } from "../../utils/formatDate";

import { renderStatusPermintaan } from "../../utils/renderStatusPermintaan";
import { useAuth } from "../../context/AuthContext";

import renderActionButton from "../../utils/renderButtonPermintaan";
import ModalKonfirmasi from "../../components/pemeriksaan/modalKonfirmasi";

import { modalKonfirmasiPermintaanConfig } from "../../config/modalKonfirmasiPermintaanConfig";

import Pagination from "../../components/common/Pagination";

import { getPaginationItems } from "../../utils/pagination";

export default function PermintaanPemeriksaanPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPerawat = user.role === "perawat" || user.role === "super admin";
  const isPasien = user.role === "pasien" || user.role === "super admin";

  const {
    permintaan,
    form,
    setForm,
    modal,
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
  } = usePermintaanPemeriksaan();
  const today = new Date().toISOString().split("T")[0];

  const currentModal = modalKonfirmasiPermintaanConfig[modal.action];

  const page = getPaginationItems(currentPage, totalPage);

  return (
    <div className="setup-container">
      {isPasien && (
        <div className="card-custom">
          <div className="card-header-flex">
            <h3>Form Permintaan Pemeriksaan</h3>
          </div>

          <div className="card-body">
            <div className="important-notice">
              <div className="important-notice-header">
                <CircleAlert size={20} />
                <strong>Perlu Diperhatikan</strong>
              </div>

              <p>
                Untuk kondisi yang membutuhkan penanganan segera, silakan
                langsung menghubungi petugas medis atau datang ke UKS
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
              }}
            >
              {/* Tanggal */}
              <div className="form-group">
                <label>Tanggal Pemeriksaan</label>

                <input
                  type="date"
                  className={
                    errors.tanggal_pemeriksaan
                      ? "date-input input-error"
                      : "date-input"
                  }
                  min={today}
                  value={form.tanggal_pemeriksaan}
                  onKeyDown={(e) => e.preventDefault()}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      tanggal_pemeriksaan: e.target.value,
                      jam_pemeriksaan: "",
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      tanggal_pemeriksaan: false,
                    }));
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Keluhan</label>
              <textarea
                className={
                  errors.keluhan ? "form-textarea input-error" : "form-textarea"
                }
                rows={4}
                placeholder="Masukkan keluhan yang sedang dialami..."
                value={form.keluhan}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    keluhan: e.target.value,
                  }));
                  setErrors((prev) => ({
                    ...prev,
                    keluhan: false,
                  }));
                }}
                required
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                className="btn-primary"
                onClick={handleTambahPermintaan}
                disabled={loading}
              >
                Daftar Pemeriksaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* CARD RIWAYAT */}
      {/* ====================================================== */}
      <div className="card-custom">
        <div className="card-body">
          <div className="table-wrapper-modern">
            <table className="modern-table permintaan-table">
              <thead>
                <tr>
                  <th>No</th>
                  {isPerawat && <th>Nama Pasien</th>}
                  <th>Waktu Kunjungan</th>
                  <th>Keluhan</th>
                  <th className="th-center">Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {permintaan.length === 0 ? (
                  <tr>
                    <td colSpan={isPasien ? 7 : 8} className="empty-table">
                      Belum ada riwayat permintaan
                    </td>
                  </tr>
                ) : (
                  permintaan.map((item, index) => (
                    <tr
                      key={permintaan.id_permintaan_pemeriksaan}
                      className="modern-row"
                    >
                      <td>{index + 1}</td>

                      {isPerawat && (
                        <td>
                          <div className="patient-name-text">
                            {item.nama_pasien}
                          </div>
                        </td>
                      )}

                      <td>
                        <div className="patient-name-text">
                          <p>
                            {formatDateTime(item.tanggal_pemeriksaan, false)}
                          </p>
                          <p>
                            {item.waktu_kunjungan_awal} -{" "}
                            {item.waktu_kunjungan_akhir}
                          </p>
                        </div>
                      </td>

                      <td className="permintaan-keluhan">
                        <div className="patient-name-text">{item.keluhan}</div>
                      </td>

                      <td className="td-center">
                        {renderStatusPermintaan(item.status)}
                      </td>

                      <td>
                        {/* ACTION PERAWAT / SUPER ADMIN */}
                        {isPerawat &&
                          item.status === "menunggu pemeriksaan" && (
                            <div className="action-button-group">
                              <button
                                className="btn-success"
                                onClick={() =>
                                  navigate(`/setup-kunjungan`, {
                                    state: {
                                      id_pasien: item.id_pasien,
                                    },
                                  })
                                }
                              >
                                Pemeriksaan
                              </button>
                            </div>
                          )}
                        {/* {isPerawat &&
                          item.status === "menunggu pemeriksaan" && (
                            <div className="action-button-group">
                              <button
                                className="btn-success"
                                onClick={() => handleOpenModal("selesai", item)}
                              >
                                Selesai
                              </button>
                            </div>
                          )} */}

                        {item.status === "menunggu pemeriksaan" && (
                          <div className="action-button-group">
                            <button
                              className="btn-batal"
                              onClick={() => handleOpenModal("batal", item)}
                            >
                              Batal
                            </button>
                          </div>
                        )}
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

      <ModalKonfirmasi
        open={modal.open}
        title={currentModal?.title}
        message={currentModal?.message}
        showAlasan={currentModal?.showAlasan}
        confirmText={currentModal?.confirmText}
        confirmClass={currentModal?.confirmClass}
        alasan={alasan}
        setAlasan={setAlasan}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        errors={errors}
        setErrors={setErrors}
        loading={loading}
        formSelesai={formSelesai}
        setFormSelesai={setFormSelesai}
        showWaktuPemeriksaan={currentModal?.showWaktuPemeriksaan}
        dataPermintaan={selectedPermintaan}
      />
    </div>
  );
}
