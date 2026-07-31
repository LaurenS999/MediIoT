import React from "react";

export default function renderActionButton(item, onAction, navigate) {
  switch (item.status) {
    case "menunggu persetujuan":
      return (
        <div className="action-button-group">
          <button
            className="btn-success"
            onClick={() => onAction("setuju", item)}
          >
            Setujui
          </button>

          <button
            className="btn-danger"
            onClick={() => onAction("tolak", item)}
          >
            Tolak
          </button>
        </div>
      );

    case "disetujui":
      return (
        <div className="action-button-group">
          <button
            className="btn-secondary"
            onClick={() => onAction("batal", item)}
          >
            Batalkan
          </button>
        </div>
      );

    default:
      return "-";
  }
}
