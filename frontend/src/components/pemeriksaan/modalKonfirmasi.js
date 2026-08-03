import React from "react";
import { formatDateTime } from "../../utils/formatDate";

export default function ModalKonfirmasi({
  open,
  title,
  message,
  showAlasan = false,
  alasan,
  setAlasan,

  showWaktuPemeriksaan = false,
  formSelesai,
  setFormSelesai,
  dataPermintaan,

  confirmText,
  confirmClass = "btn-primary",
  onClose,
  onConfirm,
  errors,
  setErrors,
  loading,
}) {
  console.log("SET ALASAN");
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: "500px" }}>
        <div className="modal-header">
          <h3>{title}</h3>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p style={{ marginBottom: "20px" }}>{message}</p>

          {showWaktuPemeriksaan && (
            <div className="confirmation-detail">
              <div className="detail-item">
                <span>Nama Pasien</span>
                <strong>{dataPermintaan.nama_pasien}</strong>
              </div>

              <div className="detail-item">
                <span>Tanggal Pemeriksaan</span>
                <strong>
                  {formatDateTime(dataPermintaan.tanggal_pemeriksaan, false)}
                </strong>
              </div>

              <div className="form-group">
                <label>Waktu Kunjungan</label>

                <div className="time-range-input">
                  <input
                    type="time"
                    className={errors.waktu_kunjungan_awal ? "input-error" : ""}
                    value={formSelesai.waktu_kunjungan_awal}
                    onChange={(e) => {
                      setErrors((prev) => ({
                        ...prev,
                        waktu_kunjungan_awal: false,
                      }));

                      setFormSelesai((prev) => ({
                        ...prev,
                        waktu_kunjungan_awal: e.target.value,
                      }));
                    }}
                  />

                  <span>sampai</span>

                  <input
                    type="time"
                    className={
                      errors.waktu_kunjungan_akhir ? "input-error" : ""
                    }
                    value={formSelesai.waktu_kunjungan_akhir}
                    onChange={(e) => {
                      setErrors((prev) => ({
                        ...prev,
                        waktu_kunjungan_akhir: false,
                      }));

                      setFormSelesai((prev) => ({
                        ...prev,
                        waktu_kunjungan_akhir: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {showAlasan && (
            <div className="form-group">
              <label>Alasan</label>

              <textarea
                className={
                  errors.alasan ? "form-textarea input-error" : "form-textarea"
                }
                rows={4}
                value={alasan}
                onChange={(e) => {
                  setErrors((prev) => ({
                    ...prev,
                    alasan: false,
                  }));

                  setAlasan(e.target.value);
                }}
                placeholder="Masukkan alasan..."
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            Batal
          </button>

          <button
            className={confirmClass}
            onClick={onConfirm}
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
