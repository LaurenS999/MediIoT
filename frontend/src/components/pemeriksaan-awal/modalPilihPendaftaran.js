import { Search, X } from "lucide-react";

import { usePendaftaranCheckIn } from "../../hooks/usePendaftaranCheckIn";

import "../../styles/modalPilihPasien.css";

export default function ModalPilihPendaftaran({ open, onClose, onSelect }) {
  const { pendaftaran, search, setSearch, loading } = usePendaftaranCheckIn();

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="patient-modal">
        {/* HEADER */}
        <div className="patient-modal-header">
          <h3>Pilih Pendaftaran</h3>

          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* SEARCH */}
        <div className="patient-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Cari kode pendaftaran atau nama pasien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST */}
        <div className="patient-list">
          {loading ? (
            <div className="empty-state">Memuat data...</div>
          ) : pendaftaran.length === 0 ? (
            <div className="empty-state">Tidak ada data pendaftaran</div>
          ) : (
            pendaftaran.map((item) => (
              <div
                key={item.id_pendaftaran}
                className="patient-row"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <div>
                  <div className="patient-name">{item.nama}</div>

                  <div className="patient-info">{item.kode_pendaftaran}</div>

                  <div className="patient-info">{item.tanggal_pemeriksaan}</div>
                </div>

                <button className="select-btn">Pilih</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
