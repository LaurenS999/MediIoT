import React from "react";
import "../../styles/modalKonfirmasi.css";

import { TriangleAlert, CircleCheckBig, Info, X } from "lucide-react";

export default function ModalKonfirmasi({
  open,
  title = "Konfirmasi",
  message = "Apakah anda yakin?",
  confirmText = "Ya",
  cancelText = "Batal",
  type = "info", // info | warning | success
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  // =====================================================
  // CONFIG TYPE
  // =====================================================
  const modalConfig = {
    info: {
      icon: Info,
      color: "#2563eb",
      background: "#eff6ff",
    },

    warning: {
      icon: TriangleAlert,
      color: "#f59e0b",
      background: "#fffbeb",
    },

    success: {
      icon: CircleCheckBig,
      color: "#10b981",
      background: "#ecfdf5",
    },
  };

  const config = modalConfig[type] || modalConfig.info;

  const Icon = config.icon;

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}
        <div className="confirm-header">
          <div
            className="confirm-icon-wrapper"
            style={{
              background: config.background,
            }}
          >
            <Icon size={28} color={config.color} />
          </div>

          <button className="close-btn" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}
        <div className="confirm-body">
          <h3>{title}</h3>

          <p>{message}</p>
        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}
        <div className="confirm-footer">
          <button className="btn-cancel" onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>

          <button
            className={`btn-confirm ${type}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Loading..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
