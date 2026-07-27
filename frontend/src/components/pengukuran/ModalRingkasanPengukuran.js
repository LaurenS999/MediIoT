import "../../styles/modalRingkasanPengukuran.css";
import { X } from "lucide-react";
import { formatTanggalIndonesia } from "../../utils/formatTanggal";
import { hitungUmur } from "../../utils/hitungUmur";
import { Jenis_Kelamin } from "../../utils/jenisKelaminUtils";
import RingkasanPengukuranCard from "./RingkasanPengukuranCard";
export default function ModalRingkasanPengukuran({
  open,
  onClose,
  onSave,
  patient,
  keluhan,
  devices,
  liveData,
  bmiResult,
  catatan,
  setCatatan,
  error,
  setError,
}) {
  if (!open) return null;

  return (
    <div className="summary-modal-overlay">
      <div className="summary-modal">
        {/* HEADER */}
        <div className="summary-header">
          <h2>Ringkasan Pengukuran</h2>

          <button className="summary-close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="summary-body">
          {/* =============================== */}
          {/* DATA PASIEN */}
          {/* =============================== */}
          <div className="summary-section">
            <h3>Data Pasien</h3>

            <div className="summary-grid">
              <div>
                <label>Nama</label>
                <p>{patient?.nama || "-"}</p>
              </div>

              <div>
                <label>ID Pasien</label>
                <p>{patient?.id_pasien || "-"}</p>
              </div>

              <div>
                <label>Tanggal Lahir</label>
                <p>{formatTanggalIndonesia(patient?.tanggal_lahir)}</p>
              </div>

              <div>
                <label>Umur</label>
                <p>{hitungUmur(patient?.tanggal_lahir)} Tahun</p>
              </div>

              <div>
                <label>Jenis Kelamin</label>
                <p>{Jenis_Kelamin(patient?.jenis_kelamin)}</p>
              </div>
            </div>
          </div>

          {/* =============================== */}
          {/* KELUHAN */}
          {/* =============================== */}
          <div className="summary-section">
            <h3>Keluhan</h3>

            <div className="summary-box">{keluhan || "-"}</div>
          </div>

          {/* =============================== */}
          {/* HASIL PENGUKURAN */}
          {/* =============================== */}

          {liveData && Object.keys(liveData).length > 0 && (
            <div className="summary-section">
              <h3>Hasil Pengukuran</h3>

              <div className="summary-measurement-list">
                {/* {devices.map((device) => (
                <RingkasanPengukuranCard
                  key={device.id}
                  device={device}
                  data={liveData[device.mac_address]}
                  bmiResult={bmiResult}
                />
              ))} */}
                {devices
                  .filter((device) => liveData[device.mac_address])
                  .map((device) => (
                    <RingkasanPengukuranCard
                      key={device.id}
                      device={device}
                      data={liveData[device.mac_address]}
                      bmiResult={bmiResult}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* =============================== */}
          {/* CATATAN */}
          {/* =============================== */}
          <div className="summary-section">
            <h3>Catatan Pemeriksaan</h3>

            <textarea
              value={catatan}
              className={
                error.catatanPemeriksaan ? "keluhan-textarea input-error" : ""
              }
              onChange={(e) => {
                setCatatan(e.target.value);

                setError((prev) => ({
                  ...prev,
                  catatanPemeriksaan: "",
                }));
              }}
              rows={5}
              placeholder='Masukkan catatan pemeriksaan. Jika tidak ada catatan pemeriksaan, tuliskan "Tidak ada".'
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="summary-footer">
          <button className="btn-secondary" onClick={onClose}>
            Batal
          </button>

          <button className="btn-primary" onClick={onSave}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
