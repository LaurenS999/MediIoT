import { formatDateTime } from "../../utils/formatDate";
import { renderStatusPendaftaran } from "../../utils/renderStatusPendaftaran";

export default function NotifikasiItemPerawat({ item, onClick }) {
  const statusText = {
    menunggu: "disetujui",
    disetujui: "check in",
    checkin: "pengukuran",
  };
  return (
    <div
      className="notification-item"
      onClick={() => onClick(item.id_pendaftaran)}
    >
      <div className="notification-item-header">
        <h4>{item.nama}</h4>

        <span className="notification">
          {renderStatusPendaftaran(item.status)}
        </span>
      </div>

      <div className="notification-item-body">
        <p>
          Menunggu proses <strong>{statusText[item.status] || "-"}</strong>
        </p>

        <small>{formatDateTime(item.dibuat_pada)}</small>
      </div>
    </div>
  );
}
