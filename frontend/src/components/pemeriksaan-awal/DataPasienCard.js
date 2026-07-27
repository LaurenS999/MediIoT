import { formatTanggalIndonesia } from "../../utils/formatTanggal";
import { hitungUmur } from "../../utils/hitungUmur";
import { Jenis_Kelamin } from "../../utils/jenisKelaminUtils";
import { UserRound, UserSearch } from "lucide-react";

export default function DataPasienCard({
  data_pasien,
  setOpenPatientModal,
  highlight,
}) {
  // =====================================
  // RENDER
  // =====================================
  return (
    <div className="card-custom">
      <div className="card-header-row">
        <div className="card-title-left">
          <UserRound size={18} />
          <span>Data Pasien</span>
        </div>

        <div>
          <button
            // className="btn-change-patient"
            className={`btn-primary ${highlight ? "highlight-button" : ""}`}
            onClick={() => setOpenPatientModal(true)}
          >
            <UserSearch size={16} />
            Ganti Pasien
          </button>
          <br></br>
          {/* <button
            className="btn-change-patient"
            onClick={() => setOpenPendaftaranModal(true)}
          >
            <UserSearch size={16} />
            Ganti Pendaftaran
          </button> */}
        </div>
      </div>
      <div className="patient-grid">
        <div className="patient-item">
          <div className="label-small">ID Pasien</div>

          <div className="value-text">{data_pasien?.id_pasien || "-"}</div>
        </div>

        <div className="patient-item">
          <div className="label-small">Nama Lengkap</div>

          <div className="value-text">{data_pasien?.nama || "-"}</div>
        </div>

        <div className="patient-item">
          <div className="label-small">Tanggal Lahir</div>

          <div className="value-text">
            {formatTanggalIndonesia(data_pasien?.tanggal_lahir) || "-"}
          </div>
        </div>

        <div className="patient-item">
          <div className="label-small">Umur / Jenis Kelamin</div>

          <div className="value-text">
            {hitungUmur(data_pasien?.tanggal_lahir)} Thn /{" "}
            {Jenis_Kelamin(data_pasien?.jenis_kelamin)}
          </div>
        </div>
        {/* <div className="patient-item">
          <div className="label-small">ID Pendaftaran</div>

          <div className="value-text">{id_pendaftaran}</div>
        </div> */}
      </div>
    </div>
  );
}
