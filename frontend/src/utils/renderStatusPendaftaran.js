import React from "react";
export function renderStatusPendaftaran(status) {
  switch (status) {
    case "menunggu persetujuan":
      return <span className="badge badge-warning">Menunggu Persetujuan</span>;

    case "ditolak":
      return <span className="badge badge-danger">Ditolak</span>;

    case "dibatalkan":
      return <span className="badge badge-secondary">Dibatalkan</span>;

    case "selesai":
      return <span className="badge badge-primary">Selesai</span>;
    case "disetujui":
      return <span className="badge badge-success">Disetujui</span>;
    default:
      return <span className="badge badge-secondary">-</span>;
  }
}
