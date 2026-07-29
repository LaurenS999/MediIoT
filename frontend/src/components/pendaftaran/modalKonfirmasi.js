import React from "react";

export default function ModalKonfirmasi({
  open,
  title,
  message,
  showAlasan = false,
  alasan,
  setAlasan,
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
