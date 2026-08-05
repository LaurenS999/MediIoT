import { useState, useEffect, useRef } from "react";

import { useLocation } from "react-router-dom";
import "../../styles/pengukuran.css";
import { UserRound, RotateCcw, UserSearch, Trash2 } from "lucide-react";
import { formatTanggalIndonesia } from "../../utils/formatTanggal";
import { hitungUmur } from "../../utils/hitungUmur";
import useBMI from "../../hooks/useBMI";
import useSavePengukuran from "../../hooks/useSavePengukuran";
import PengukuranCard from "../../components/pengukuran/PengukuranCard";
import usePengukuranSocketEngine from "../../hooks/usePengukuranSocketEngine";
import { useAuth } from "../../context/AuthContext";
import ModalPilihPasien from "../../components/pasien/ModalPilihPasien";
import { Jenis_Kelamin } from "../../utils/jenisKelaminUtils";
import { toast } from "react-toastify";
import useStatusDevice from "../../hooks/useStatusDevice";

import ModalRingkasanPengukuran from "../../components/pengukuran/ModalRingkasanPengukuran";

import DataPasienCard from "../../components/pemeriksaan-awal/DataPasienCard";

import { usePasienDetail } from "../../hooks/usePasienDetail";

import UploadLampiranModal from "../../components/lampiranModal/UploadLampiranModal";

import Lampiran from "../../components/lampiran/Lampiran";
import { showToast } from "../../utils/toast";

export default function PemeriksaanAwalPage() {
  const { state } = useLocation();
  const patientCardRef = useRef(null);

  const [openModalKonfirmasi, setOpenModalKonfirmasi] = useState(false);

  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [catatanPemeriksaan, setCatatanPemeriksaan] = useState("");

  const [gatewayStatus, setGatewayStatus] = useState({});

  const [highlightPatientButton, setHighlightPatientButton] = useState(false);
  const { user, hasRole } = useAuth();

  // =====================================
  // SAVE
  // =====================================
  const {
    savePengukuran,
    isSaving,
    isSaved,
    setIsSaving,
    setIsSaved,
    keluhan,
    setKeluhan,
    error,
    setError,
  } = useSavePengukuran();

  // =====================================
  // ROUTE STATE
  // =====================================
  const [selectedPatient, setSelectedPatient] = useState(
    state?.patient || null,
  );

  const { pasienDetail, setPasienDetail } = usePasienDetail(
    selectedPatient?.id_pasien,
  );

  const devices = state?.devices || [];

  const [waktuKunjunganAwal, setWaktu_Kunjungan_Awal] = useState(
    state?.waktu_kunjungan_awal || "",
  );

  const [openPatientModal, setOpenPatientModal] = useState(false);

  const { updateHeartbeat } = useStatusDevice();

  const [draftLampiran, setDraftLampiran] = useState([]);
  const [showUploadLampiran, setShowUploadLampiran] = useState(false);

  // =====================================
  // LIVE DATA
  // =====================================
  const [liveData, setLiveData] = useState({});

  // =====================================
  // BMI
  // =====================================
  const [tinggiBadan, setTinggiBadan] = useState("");

  const { bmiResult, setBmiResult } = useBMI({
    devices,
    liveData: liveData,
    patient: pasienDetail,
    tinggiBadan: tinggiBadan,
  });

  // =====================================
  // SOCKET
  // =====================================
  usePengukuranSocketEngine({
    devices,
    setLiveData,
    setGatewayStatus,
  });

  // =====================================
  // HANDLE SAVE
  // =====================================
  const handleSaveMeasurement = async () => {
    if (selectedPatient === null) {
      toast.warning("BELUM MEMILIH PASIEN");
      return;
    }

    const success = await savePengukuran({
      patient: pasienDetail,
      devices,
      liveData,
      bmiResult,
      tinggiBadan,
      keluhan,
      catatanPemeriksaan,
      draftLampiran,
      waktu_kunjungan_awal: waktuKunjunganAwal,
    });

    if (error.catatanPemeriksaan) {
      return;
    }

    if (success) {
      setSelectedPatient(null);
      setPasienDetail(null);

      setKeluhan("");
      setCatatanPemeriksaan("");

      setLiveData({});
      setBmiResult(null);
      setTinggiBadan("");
      setDraftLampiran([]);

      patientCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setHighlightPatientButton(true);
    }

    setOpenSummaryModal(false);
  };

  const handleSelectPatient = (patientBaru) => {
    setSelectedPatient(patientBaru);

    // toast.success("Berhasil mengganti pasien");

    showToast(
      "Berhasil Mengganti Pasien",
      "pemeriksaan-awal-ganti-pasien",
      "success",
    );

    setLiveData({});
    setTinggiBadan("");
    setKeluhan("");

    const waktuKunjunganAwal = new Date().toTimeString().slice(0, 8);
    setWaktu_Kunjungan_Awal(waktuKunjunganAwal);

    setHighlightPatientButton(true);

    setDraftLampiran([]);

    setBmiResult(null);

    setIsSaved(false);
    setIsSaving(false);
  };

  useEffect(() => {
    if (devices.length === 0) return;

    const interval = setInterval(() => {
      devices.forEach((device) => {
        updateHeartbeat(device.mac_address);
        console.log("20 DETIK");
      });
    }, 20000); // 20 detik

    return () => clearInterval(interval);
  }, [devices, updateHeartbeat]);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDeleteDraft = (index) => {
    setDraftLampiran((prev) => prev.filter((_, i) => i !== index));
  };

  // =====================================
  // RENDER
  // =====================================
  return (
    <div className="panel-container">
      <div ref={patientCardRef}> </div>
      {/* ===================================== */}
      {/* DATA PASIEN */}
      {/* ===================================== */}
      <DataPasienCard
        data_pasien={pasienDetail}
        setOpenPatientModal={setOpenPatientModal}
        highlight={highlightPatientButton}
      />

      {/* CARD KELUHAN AWAL */}
      <div className="card-custom">
        <div className="card-header-row">
          <div className="card-title-left">
            <span>Keluhan</span>
          </div>
        </div>

        <textarea
          className={
            error.keluhan ? "keluhan-textarea input-error" : "keluhan-textarea"
          }
          placeholder='Masukkan keluhan yang disampaikan pasien. Jika tidak ada keluhan, tuliskan "Tidak ada".'
          value={keluhan}
          onChange={(e) => {
            setKeluhan(e.target.value);

            setError((prev) => ({
              ...prev,
              keluhan: "",
            }));
          }}
          rows={2}
        />
      </div>

      <div className="card-custom ">
        <Lampiran
          files={draftLampiran}
          onAdd={() => setShowUploadLampiran(true)}
          onDelete={handleDeleteDraft}
        />
      </div>

      {/* ===================================== */}
      {/* DEVICE GRID */}
      {/* ===================================== */}
      <div className="measurement-grid">
        {devices.map((device) => {
          const key = device.mac_address;

          const dataAlat = liveData[key];

          return (
            <PengukuranCard
              key={device.id}
              device={device}
              dataAlat={dataAlat}
              tinggiBadan={tinggiBadan}
              setTinggiBadan={setTinggiBadan}
              bmiResult={bmiResult}
              setLiveData={setLiveData}
            />
          );
        })}
      </div>

      {/* ===================================== */}
      {/* ACTION BUTTON */}
      {/* ===================================== */}
      <div className="action-buttons">
        <div></div>

        {hasRole(user?.role, ["perawat", "super admin"]) && (
          <button
            className="btn-primary"
            onClick={() => setOpenSummaryModal(true)}
            disabled={isSaving || isSaved}
          >
            {isSaving
              ? "Menyimpan..."
              : isSaved
                ? "Sudah Disimpan"
                : "Simpan Hasil"}
          </button>
        )}
      </div>

      {/* ===================================== */}
      {/* MODAL */}
      {/* ===================================== */}

      <ModalPilihPasien
        open={openPatientModal}
        onClose={() => setOpenPatientModal(false)}
        onSelect={handleSelectPatient}
      />

      <ModalRingkasanPengukuran
        open={openSummaryModal}
        onClose={() => setOpenSummaryModal(false)}
        onSave={handleSaveMeasurement}
        patient={pasienDetail}
        keluhan={keluhan}
        devices={devices}
        liveData={liveData}
        bmiResult={bmiResult}
        catatan={catatanPemeriksaan}
        setCatatan={setCatatanPemeriksaan}
        error={error}
        setError={setError}
        lampiran={draftLampiran}
      />

      <UploadLampiranModal
        open={showUploadLampiran}
        onClose={() => setShowUploadLampiran(false)}
        onSave={(lampiranBaru) => {
          setDraftLampiran((prev) => [...prev, ...lampiranBaru]);
        }}
      />
    </div>
  );
}
