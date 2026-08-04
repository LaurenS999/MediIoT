import { formatDateTime } from "../../utils/formatDate";

export default function NotifikasiItemDokter({ item, onClick }) {
  return (
    <div
      className="notification-item"
      onClick={() => onClick(item?.id_pemeriksaan)}
    >
      <div className="notification-item-header">
        <h4>{item?.nama}</h4>

        <span className="notification-status">Menunggu</span>
      </div>

      <div className="notification-item-body">
        <p>
          Pemeriksaan oleh <strong>{item?.nama_perawat}</strong>
        </p>

        <small>{formatDateTime(item?.dibuat_pada)}</small>
      </div>
    </div>
  );
}
