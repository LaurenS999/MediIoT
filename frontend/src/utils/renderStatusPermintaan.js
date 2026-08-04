export function renderStatusPermintaan(status) {
  switch (status) {
    case "menunggu pemeriksaan":
      return (
        <span className="badge badge-warning badge-status-permintaan">
          Menunggu Pemeriksaan
        </span>
      );

    case "dibatalkan":
      return (
        <span className="badge badge-secondary badge-status-permintaan">
          Dibatalkan
        </span>
      );

    case "selesai":
      return (
        <span className="badge badge-primary badge-status-permintaan">
          Selesai
        </span>
      );

    default:
      return (
        <span className="badge badge-secondary badge-status-permintaan">-</span>
      );
  }
}
