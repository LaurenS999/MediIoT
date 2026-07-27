import React from "react";
export function renderStatusPendaftaran(status) {
  switch (status) {
    case "menunggu":
      return <span className="badge badge-warning">Menunggu</span>;

    case "disetujui":
      return <span className="badge badge-success">Disetujui</span>;

    case "ditolak":
      return <span className="badge badge-danger">Ditolak</span>;

    case "dibatalkan":
      return <span className="badge badge-secondary">Dibatalkan</span>;

    case "checkin":
      return <span className="badge badge-info">Check In</span>;

    case "selesai":
      return <span className="badge badge-primary">Selesai</span>;

    default:
      return <span className="badge badge-secondary">-</span>;
  }
}
