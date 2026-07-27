import React from "react";

export default function ModalKonfirmasi({
  open,
  title,
  message,
  showReason = false,
  reason,
  onReasonChange,
  confirmText,
  confirmClass = "btn-primary",
  onClose,
  onConfirm,
}) {
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
          {showReason && (
            <div className="form-group">
              <label>Alasan</label>

              <textarea
                rows={4}
                value={reason}
                onChange={(e) => onReasonChange(e.target.value)}
                placeholder="Masukkan alasan..."
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Batal
          </button>

          <button className={confirmClass} onClick={onConfirm}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
