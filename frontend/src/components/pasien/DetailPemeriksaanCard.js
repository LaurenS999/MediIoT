import "../../styles/detailPemeriksaanCard.css";
import { formatDateTime } from "../../utils/formatDate";
export function DetailPemeriksaanCard({ pemeriksaan }) {
  return (
    <div className="examination-card">
      <div className="card-header">
        <h3>Hasil Pemeriksaan</h3>
        <p>{formatDateTime(pemeriksaan?.dibuat_pada) || ""}</p>
      </div>

      <div className="card-body-pemeriksaan">
        <div className="field">
          <label>Keluhan</label>
          <p>{pemeriksaan?.keluhan || "-"}</p>
        </div>

        <div className="field">
          <label>Diagnosa</label>
          <p>{pemeriksaan?.diagnosa || "-"}</p>
        </div>

        <div className="field">
          <label>Catatan Perawat</label>
          <p>{pemeriksaan?.catatan_perawat || "-"}</p>
        </div>

        <div className="field">
          <label>Catatan Dokter</label>
          <p>{pemeriksaan?.catatan_dokter || "-"}</p>
        </div>

        <div className="field field-full">
          <label>Status Pasien</label>

          <span className={`status ${pemeriksaan?.status_pasien}`}>
            {pemeriksaan?.status_pasien || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
