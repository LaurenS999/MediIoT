import React, {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../../styles/setupPengukuran.css";
import { usePasien } from "../../hooks/usePasien";
import { useAuth } from "../../context/AuthContext";

import useJenisPengukuran from "../../hooks/useJenisPengukuran";
import useDevice from "../../hooks/useDevice";

import { hitungUmur } from "../../utils/hitungUmur";
import { Jenis_Kelamin } from "../../utils/jenisKelaminUtils";
import { formatTanggalIndonesia } from "../../utils/formatTanggal";
import { formatJenisPengukuran } from "../../utils/formatJenisPengukuran";
import { toast } from "react-toastify";
import { createStatusDevice } from "../../services/deviceService";

import useStatusDevice from "../../hooks/useStatusDevice";
import { useSearchParams } from "react-router-dom";
import { getDetailPasien } from "../../services/pasienService";

import { Search } from "lucide-react";

export default function SetupPemeriksaanAwalPage() {
  const { user } = useAuth();
  const { state } = useLocation();

  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const [searchParams] = useSearchParams();

  const idPasienDariUrl = searchParams.get("id_pasien");

  const [id_pasien, setId_Pasien] = useState(idPasienDariUrl || "");

  // const id_pasien = searchParams.get("id_pasien") || "";
  // const id_pasien = state?.id_pasien || "";

  // =====================================================
  // PASIEN
  // =====================================================
  const { pasien, search, setSearch } = usePasien();

  // =====================================================
  // JENIS PENGUKURAN
  // =====================================================
  const { jenisPengukuran } = useJenisPengukuran();
  console.log("JENIS PENGUKURAN : ", jenisPengukuran);

  // =====================================================
  // DEVICE
  // =====================================================
  const {
    devices,
    setDevices,
    loading: loadingDevice,
    error: errorDevice,
    ambilListDevice,
  } = useDevice();

  const { usedDeviceSet, fetchStatusDevice } = useStatusDevice();

  // =====================================================
  // STATE
  // =====================================================

  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [selectedMeasurements, setSelectedMeasurements] = useState([]);

  const [selectedDevices, setSelectedDevices] = useState([]);

  const [jenisPengukuranSearch, setJenisPengukuranSearch] = useState("");

  const [errorPasien, setErrorPasien] = useState(false);

  // =====================================================
  // FILTER JENIS PENGUKURAN
  // =====================================================
  const filteredJenisPengukuran = jenisPengukuran.filter((item) =>
    item.nama.toLowerCase().includes(jenisPengukuranSearch.toLowerCase()),
  );

  const [openGroups, setOpenGroups] = useState({});

  const groupedJenisPengukuran = filteredJenisPengukuran.reduce(
    (groups, item) => {
      if (!groups[item.grup]) {
        groups[item.grup] = [];
      }

      groups[item.grup].push(item);

      return groups;
    },
    {},
  );

  const toggleGroup = (group) => {
    setOpenGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  // =====================================================
  // CLICK OUTSIDE
  // =====================================================
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =====================================================
  // FETCH DEVICE
  // =====================================================
  useEffect(() => {
    if (selectedMeasurements.length === 0) {
      setDevices([]);
      return;
    }

    const payload = {
      page: 1,
      limit: 9999,
      gateways: user.bertugas_di,
      params: selectedMeasurements,
      is_online: true,
    };

    if (selectedMeasurements.length > 0) {
      payload.params = selectedMeasurements.join(",");
    } else {
      payload.params = "";
    }

    ambilListDevice(payload);
    fetchStatusDevice();
  }, [selectedMeasurements]);

  const availableDevices = devices.filter(
    (device) => !usedDeviceSet.has(device.mac_address),
  );

  // =====================================================
  // RESET DEVICE
  // =====================================================
  useEffect(() => {
    if (selectedMeasurements.length === 0) {
      setSelectedDevices([]);
    }
  }, [selectedMeasurements]);

  // =====================================================
  // GROUP DEVICE
  // =====================================================
  const groupedDevices = useMemo(() => {
    const groups = {};

    availableDevices.forEach((device) => {
      const type = device.device_function || "UNKNOWN";

      if (!groups[type]) {
        groups[type] = [];
      }

      groups[type].push(device);
    });

    return groups;
  }, [devices]);

  // =====================================================
  // SELECT PASIEN
  // =====================================================
  const handleSelectPatient = (pasien) => {
    setSelectedPatient(pasien);

    setShowSuggestions(false);
  };

  useEffect(() => {
    if (!id_pasien) return;

    const fetchPasien = async () => {
      try {
        const res = await getDetailPasien(id_pasien);

        handleSelectPatient(res.data.data.pasien);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPasien();
  }, [id_pasien]);

  // =====================================================
  // TOGGLE MEASUREMENT
  // =====================================================
  const toggleMeasurement = (type) => {
    setSelectedMeasurements((prev) => {
      const exists = prev.includes(type);

      if (exists) {
        return prev.filter((t) => t !== type);
      }

      return [...prev, type];
    });
  };

  // =====================================================
  // TOGGLE DEVICE
  // =====================================================
  const toggleDevice = (device) => {
    setSelectedDevices((prev) => {
      const isUsed = usedDeviceSet.has(device.mac_address);
      if (isUsed) {
        toast.error("Device sedang digunakan. Pilih device yang lain", {
          toastId: "setup-pemeriksaan-awal-deivce-sedang-digunakan",
        });
        return prev;
      }

      const exists = prev.find((d) => d.id === device.id);

      if (exists) {
        return prev.filter((d) => d.id !== device.id);
      }

      const sameTypeExists = prev.some(
        (d) => d.device_function === device.device_function,
      );

      if (sameTypeExists) {
        toast.error(
          `Device ${formatJenisPengukuran(device.device_function)} sudah dipilih`,
        );

        return prev;
      }

      return [...prev, device];
    });
  };

  // =====================================================
  // START
  // =====================================================
  const handleStart = async () => {
    const noPatient = !selectedPatient;

    if (noPatient) {
      let pesan = "Anda belum memilih pasien";
      setErrorPasien(true);

      toast.error(pesan);
      return;
    }

    try {
      await Promise.all(
        selectedDevices.map((device) =>
          createStatusDevice({
            mac_address: device.mac_address,
            device_function: device.device_function,
          }),
        ),
      );

      sessionStorage.setItem(
        "activeDevices",
        JSON.stringify(
          selectedDevices.map((device) => ({
            mac_address: device.mac_address,
          })),
        ),
      );

      navigate("/pemeriksaan-awal", {
        state: {
          patient: selectedPatient,
          devices: selectedDevices,
        },
      });
    } catch (error) {
      console.error(error);

      if (error.response.status === 409) {
        toast.error("Device sedang digunakan");
      } else {
        toast.error("Internal Server Error");
      }
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-container">
        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}
        <div className="setup-header">
          <h1>Setup Pemeriksaan Awal</h1>

          <p>Pilih pasien, jenis pengukuran, dan device.</p>
        </div>

        {/* ===================================== */}
        {/* PASIEN */}
        {/* ===================================== */}
        <div className="patient-card">
          <div className="card-title-row">
            <h2>Pilih Pasien</h2>

            {selectedPatient && (
              <div className="success-badge">Pasien Terpilih</div>
            )}
          </div>

          <div ref={wrapperRef} className="search-wrapper">
            <Search size={18} className="search-icon" />

            <input
              type="text"
              className={
                errorPasien == true
                  ? "search-input input-error"
                  : "search-input"
              }
              placeholder="Cari nama atau ID pasien..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setShowSuggestions(true);

                setErrorPasien(false);

                if (selectedPatient) {
                  setSelectedPatient(null);
                }
              }}
            />

            {search && (
              <button
                className="clear-button"
                onClick={() => {
                  setSearch("");

                  setSelectedPatient(null);
                }}
              >
                ✕
              </button>
            )}

            {showSuggestions && search.length > 0 && (
              <ul className="suggestions-list">
                {pasien.length === 0 ? (
                  <li className="suggestion-item suggestion-empty">
                    Pasien tidak ditemukan
                  </li>
                ) : (
                  pasien.map((patient) => (
                    <li
                      key={patient.id}
                      className="suggestion-item"
                      onClick={() => handleSelectPatient(patient)}
                    >
                      <strong>{patient.kode_pasien}</strong> - {patient.nama}
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          <div
            className={`patient-info-wrapper ${selectedPatient ? "show" : ""}`}
          >
            {selectedPatient && (
              <div className="patient-info-grid">
                <div>
                  <span>Kode Pasien</span>

                  <strong>{selectedPatient.kode_pasien}</strong>
                </div>

                <div>
                  <span>Nama</span>

                  <strong>{selectedPatient.nama}</strong>
                </div>

                <div>
                  <span>Tanggal Lahir</span>

                  <strong>
                    {formatTanggalIndonesia(selectedPatient.tanggal_lahir)}
                  </strong>
                </div>

                <div>
                  <span>Umur / Jenis Kelamin</span>

                  <strong>
                    {hitungUmur(selectedPatient.tanggal_lahir)} /{" "}
                    {Jenis_Kelamin(selectedPatient.jenis_kelamin)}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================================== */}
        {/* FILTER SECTION */}
        {/* ===================================== */}
        <div className="filter-layout">
          {/* JENIS */}
          <div className="card-box">
            <div className="card-box-header">
              <h2>Jenis Pengukuran</h2>

              <div className="selected-count">
                {selectedMeasurements.length} Dipilih
              </div>
            </div>

            <div className="search-wrapper">
              <Search size={18} className="search-icon" />

              <input
                type="text"
                placeholder="Cari jenis pengukuran..."
                className="search-input"
                value={jenisPengukuranSearch}
                onChange={(e) => setJenisPengukuranSearch(e.target.value)}
              />
            </div>

            {/* INI YANG SCROLL */}
            <div className="measurement-list">
              {Object.entries(groupedJenisPengukuran).map(
                ([group, measurements]) => (
                  <div className="measurement-group" key={group}>
                    <div className="measurement-group-title">{group}</div>

                    {measurements.map((type) => {
                      const isSelected = selectedMeasurements.includes(
                        type.jenis_pengukuran,
                      );

                      return (
                        <label
                          key={type.jenis_pengukuran}
                          className={`measurement-item ${
                            isSelected ? "active" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              toggleMeasurement(type.jenis_pengukuran)
                            }
                          />

                          <span>{type.nama}</span>
                        </label>
                      );
                    })}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="device-panel">
            <div className="device-header">
              <div>
                <h2>Daftar Device</h2>

                <p>Device berdasarkan filter yang dipilih.</p>
              </div>

              <div className="device-count">{devices.length} Device</div>
            </div>

            {loadingDevice ? (
              <div className="empty-device">Mengambil data device...</div>
            ) : errorDevice ? (
              <div className="empty-device">{errorDevice}</div>
            ) : selectedMeasurements.length === 0 ? (
              <div className="empty-device">
                Belum memilih jenis pengukuran.
              </div>
            ) : Object.keys(groupedDevices).length === 0 ? (
              <div className="empty-device">Device tidak ditemukan.</div>
            ) : (
              <div className="device-sections">
                {Object.entries(groupedDevices).map(([groupName, group]) => (
                  <div key={groupName} className="device-section">
                    <div className="section-header">
                      <h3>{formatJenisPengukuran(groupName)}</h3>

                      <p>{group.length} device</p>
                    </div>

                    <div className="device-grid">
                      {group
                        .filter(
                          (device) => !usedDeviceSet.has(device.mac_address),
                        )
                        .map((device) => {
                          const isSelected = selectedDevices.find(
                            (d) => d.id === device.id,
                          );

                          const isDisabled = selectedDevices.some(
                            (selected) =>
                              selected.device_function ===
                                device.device_function &&
                              selected.id !== device.id,
                          );

                          return (
                            <div
                              key={device.id}
                              className={`
                                device-card
                                ${isSelected ? "selected" : ""}
                                ${isDisabled ? "disabled" : ""}
                              `}
                              onClick={() => {
                                if (isDisabled) return;

                                toggleDevice(device);
                              }}
                            >
                              <div className="device-card-header">
                                <h4>{device.name}</h4>

                                {isSelected && (
                                  <span className="selected-badge">
                                    ✓ Dipilih
                                  </span>
                                )}
                              </div>

                              <div className="device-status-list">
                                <div className="status-item">
                                  <span>Status Koneksi</span>

                                  <span
                                    className={`badge ${
                                      device.is_connected
                                        ? "connected"
                                        : "disconnected"
                                    }`}
                                  >
                                    {device.is_connected ? "Online" : "Offline"}
                                  </span>
                                </div>

                                <div className="status-item">
                                  <span>Status Device</span>

                                  <span className="badge available">
                                    Tersedia
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FOOTER */}
            <div className="selected-device-footer">
              <div>
                <h3>{selectedDevices.length} Device Dipilih</h3>

                <div className="selected-tags">
                  {selectedDevices.map((device) => (
                    <div key={device.id} className="selected-tag">
                      {device.name}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStart}
                className="btn-start"
                disabled={selectedDevices.length === 0}
              >
                Mulai Pengukuran
              </button>
            </div>
          </div>
        </div>

        {/* ===================================== */}
        {/* DEVICE */}
        {/* ===================================== */}
      </div>
    </div>
  );
}
