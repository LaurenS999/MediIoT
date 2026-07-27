import React from "react";

export default function renderActionButton(item, onAction, navigate) {
  switch (item.status) {
    case "menunggu":
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
            className="btn-info"
            onClick={() => onAction("check_in", item)}
          >
            Check In
          </button>

          <button
            className="btn-secondary"
            onClick={() => onAction("batal", item)}
          >
            Batalkan
          </button>
        </div>
      );

    case "checkin":
      return (
        <div className="action-button-group">
          <button
            className="btn-info"
            onClick={() =>
              navigate(`/setup-kunjungan`, {
                state: {
                  id_pasien: item.id_pasien,
                  id_pendaftaran: item.id_pendaftaran,
                },
              })
            }
          >
            Pengukuran
          </button>
        </div>
      );

    default:
      return "-";
  }
}
