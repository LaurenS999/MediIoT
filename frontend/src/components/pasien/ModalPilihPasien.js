import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import axios from "axios";

import { usePasien } from "../../hooks/usePasien";

import "../../styles/modalPilihPasien.css";

export default function ModalPilihPasien({ open, onClose, onSelect }) {
  const [loading, setLoading] = useState(false);

  const { pasien, search, setSearch } = usePasien();

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="patient-modal">
        {/* HEADER */}
        <div className="patient-modal-header">
          <h3>Pilih Pasien</h3>

          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* SEARCH */}
        <div className="patient-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Cari nama pasien atau ID pasien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST */}
        <div className="patient-list">
          {loading ? (
            <div className="empty-state">Memuat data...</div>
          ) : pasien.length === 0 ? (
            <div className="empty-state">Tidak ada data pasien</div>
          ) : (
            pasien.map((pasien) => (
              <div
                key={pasien.id_pasien}
                className="patient-row"
                onClick={() => {
                  onSelect(pasien);
                  onClose();
                }}
              >
                <div>
                  <div className="patient-name">{pasien.nama}</div>

                  <div className="patient-info">ID : {pasien.id_pasien}</div>
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
