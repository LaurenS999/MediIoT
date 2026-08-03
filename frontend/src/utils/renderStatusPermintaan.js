import React from "react";
export function renderStatusPermintaan(status) {
  switch (status) {
    case "menunggu pemeriksaan":
      return <span className="badge badge-warning">Menunggu Pemeriksaan</span>;

    case "dibatalkan":
      return <span className="badge badge-secondary">Dibatalkan</span>;

    case "selesai":
      return <span className="badge badge-primary">Selesai</span>;

    default:
      return <span className="badge badge-secondary">-</span>;
  }
}
