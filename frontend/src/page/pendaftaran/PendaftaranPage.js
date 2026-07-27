import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/pasien.css";
import "../../styles/pendaftaran.css";

import { usePendaftaran } from "../../hooks/usePendaftaran";
import { formatDateTime } from "../../utils/formatDate";

import { renderStatusPendaftaran } from "../../utils/renderStatusPendaftaran";
import { useAuth } from "../../context/AuthContext";

import renderActionButton from "../../utils/renderButtonPendaftaran";
import ModalKonfirmasi from "../../components/pendaftaran/modalKonfirmasi";

import { modalKonfirmasiPendaftaranConfig } from "../../config/modalKonfirmasiPendaftaranConfig";

export default function PendaftaranPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPerawat = user.role === "perawat" || user.role === "super admin";
  const isPasien = user.role === "pasien" || user.role === "super admin";

  const {
    pendaftaran,
    form,
    setForm,
    modal,
    reason,
    setReason,
    handleOpenModal,
    handleCloseModal,
    handleTambahPendaftaran,
    handleConfirm,
  } = usePendaftaran();
  const today = new Date().toISOString().split("T")[0];

  const pendaftaranAktif = pendaftaran.find((item) =>
    ["menunggu", "disetujui", "checkin"].includes(item.status),
  );

  const currentModal = modalKonfirmasiPendaftaranConfig[modal.action];

  return (
    <div className="setup-container">
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Pendaftaran Pemeriksaan</h1>

          <p className="page-subtitle">
            Daftar pemeriksaan dan lihat riwayat pendaftaran Anda.
          </p>
        </div>
      </div>

      {isPasien && !pendaftaranAktif && (
        <div className="card-custom">
          <div className="card-header-flex">
            <h3>Form Pendaftaran Pemeriksaan</h3>
          </div>

          <div className="card-body">
            <div className="form-group">
              <label>Tanggal Pemeriksaan</label>
              <input
                type="date"
                className="date-input"
                min={today}
                value={form.tanggal_pemeriksaan}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    tanggal_pemeriksaan: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Keluhan</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Masukkan keluhan yang sedang dialami..."
                value={form.keluhan}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    keluhan: e.target.value,
                  }))
                }
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
              <button className="btn-primary" onClick={handleTambahPendaftaran}>
                Daftar Pemeriksaan
              </button>
            </div>
          </div>
        </div>
      )}

      {isPasien && pendaftaranAktif && (
        <div className="card-custom">
          <div className="card-header-flex">
            <h3>Pendaftaran Aktif</h3>
          </div>

          <div className="card-body">
            <div className="pendaftaran-info-grid">
              <div className="info-card">
                <span className="info-label">Kode Pendaftaran</span>
                <div className="info-value">
                  {pendaftaranAktif.kode_pendaftaran}
                </div>
              </div>

              <div className="info-card">
                <span className="info-label">Status</span>
                <div className="info-value">
                  {renderStatusPendaftaran(pendaftaranAktif.status)}
                </div>
              </div>

              <div className="info-card">
                <span className="info-label">Tanggal Pemeriksaan</span>
                <div className="info-value">
                  {formatDateTime(pendaftaranAktif.tanggal_pemeriksaan, false)}
                </div>
              </div>

              <div className="info-card">
                <span className="info-label">Keluhan</span>
                <div className="info-value">{pendaftaranAktif.keluhan}</div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              {pendaftaranAktif.status !== "checkin" && (
                <button
                  className="btn-danger"
                  onClick={() => handleOpenModal("batal", pendaftaranAktif)}
                >
                  Batalkan Pendaftaran
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* CARD RIWAYAT */}
      {/* ====================================================== */}
      <div className="card-custom" style={{ marginTop: "24px" }}>
        <div className="card-header-flex">
          <h3>Daftar Pendaftaran</h3>
        </div>

        <div className="card-body">
          <div className="table-wrapper-modern">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Kode Pendaftaran</th>
                  {isPerawat && <th>Nama Pasien</th>}

                  <th>Tanggal Pemeriksaan</th>
                  <th>Keluhan</th>
                  <th>Status</th>
                  {isPerawat && <th>Action</th>}
                </tr>
              </thead>

              <tbody>
                {pendaftaran.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-table">
                      Belum ada riwayat pendaftaran
                    </td>
                  </tr>
                ) : (
                  pendaftaran.map((item, index) => (
                    <tr key={pendaftaran.id_pendaftaran} className="modern-row">
                      <td>
                        <div className="patient-id-text">
                          {item.kode_pendaftaran}
                        </div>
                      </td>

                      {isPerawat && (
                        <td>
                          <div className="patient-name-text">
                            {item.nama_pasien}
                          </div>
                        </td>
                      )}

                      <td>
                        <div className="patient-name-text">
                          {formatDateTime(item.tanggal_pemeriksaan, false)}
                        </div>
                      </td>

                      <td>
                        <div className="patient-name-text">{item.keluhan}</div>
                      </td>

                      <td>{renderStatusPendaftaran(item.status)}</td>

                      {isPerawat && (
                        <td>
                          {renderActionButton(item, handleOpenModal, navigate)}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModalKonfirmasi
        open={modal.open}
        title={currentModal?.title}
        message={currentModal?.message}
        showReason={currentModal?.showReason}
        confirmText={currentModal?.confirmText}
        confirmClass={currentModal?.confirmClass}
        reason={reason}
        onReasonChange={setReason}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
