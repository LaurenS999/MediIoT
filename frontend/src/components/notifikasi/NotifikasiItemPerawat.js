import { formatDateTime } from "../../utils/formatDate";
import { renderStatusPermintaan } from "../../utils/renderStatusPermintaan";

export default function NotifikasiItemPerawat({ item, onClick }) {
  return (
    <div className="notification-item" onClick={() => onClick(item)}>
      <div className="notification-item-header">
        <h4>{item?.nama}</h4>

        <span className="notification">
          {renderStatusPermintaan(item?.status)}
        </span>
      </div>

      <div className="notification-item-body">
        <p>
          Menunggu Pemeriksaan Dokter <strong>menunggu</strong>
        </p>

        <small>{formatDateTime(item?.dibuat_pada)}</small>
      </div>
    </div>
  );
}
