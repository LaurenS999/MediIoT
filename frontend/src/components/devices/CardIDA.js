import { Baby, User } from "lucide-react";

export default function CardTimbanganIbuBayi({ data, setLiveData, device }) {
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
      {/* BERAT IBU */}
      {/* ===================================== */}
      <div className="device-item-card compact">
        <User size={20} className="color-blue" />

        <div className="device-label">Berat Ibu</div>

        <div className="device-value-wrapper">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="65"
            value={data?.weight_mother ?? ""}
            onChange={(e) => updateData("weight_mother", e.target.value)}
            className="device-manual-input"
          />

          <span className="device-unit">Kg</span>
        </div>
      </div>

      {/* ===================================== */}
      {/* BERAT BAYI */}
      {/* ===================================== */}
      <div className="device-item-card compact">
        <Baby size={20} className="color-pink" />

        <div className="device-label">Berat Bayi</div>

        <div className="device-value-wrapper">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="3.2"
            value={data?.weight_baby ?? ""}
            onChange={(e) => updateData("weight_baby", e.target.value)}
            className="device-manual-input"
          />

          <span className="device-unit">Kg</span>
        </div>
      </div>
    </div>
  );
}
