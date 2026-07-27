import { HeartPulse, Activity } from "lucide-react";

export default function CardOxy({ data, setLiveData, device }) {
  // =====================================
  // UPDATE DATA
  // =====================================
  const updateData = (field, value) => {
    setLiveData((prev) => {
      const macAddress = device.mac_address;

      const currentData = {
        ...(prev[macAddress] || data || {}),
        mac: macAddress,
      };

      // Jika input dikosongkan
      if (value === "") {
        delete currentData[field];

        // Cek apakah masih ada data selain mac dan metadata
        const hasMeasurementData = Object.keys(currentData).some(
          (key) => key !== "mac" && key !== "device_function",
        );

        // Jika tidak ada data pengukuran lagi, hapus device
        if (!hasMeasurementData) {
          const newData = { ...prev };

          delete newData[macAddress];

          return newData;
        }

        return {
          ...prev,
          [macAddress]: currentData,
        };
      }

      // Simpan nilai baru
      currentData[field] = Number(value);

      return {
        ...prev,
        [macAddress]: currentData || "",
      };
    });
  };

  return (
    <div className="device-grid">
      {/* ===================================== */}
      {/* SPO2 */}
      {/* ===================================== */}
      <div className="device-item-card compact">
        <Activity size={20} className="color-blue" />

        <div className="device-label">SpO2</div>

        <div className="device-value-wrapper">
          <input
            type="number"
            min="0"
            max="100"
            placeholder={"98"}
            value={data?.spo2 ?? ""}
            onChange={(e) => updateData("spo2", e.target.value)}
            className="device-manual-input"
          />

          <span className="device-unit">%</span>
        </div>
      </div>

      {/* ===================================== */}
      {/* PULSE */}
      {/* ===================================== */}
      <div className="device-item-card compact">
        <HeartPulse size={20} className="color-red" />

        <div className="device-label">Pulse Rate</div>

        <div className="device-value-wrapper">
          <input
            type="number"
            min="0"
            placeholder="75"
            value={data?.pulse_rate ?? ""}
            onChange={(e) => updateData("pulse_rate", e.target.value)}
            className="device-manual-input"
          />

          <span className="device-unit">bpm</span>
        </div>
      </div>
    </div>
  );
}
