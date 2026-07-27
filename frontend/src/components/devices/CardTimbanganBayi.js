import { Hourglass } from "lucide-react";
import { removeDeviceIfEmpty } from "../../helpers/removeDeviceIfEmpty";

export default function CardTimbanganBayi({ data, setLiveData, device }) {
  // =====================================
  // UPDATE DATA
  // =====================================
  const updateWeight = (field, value) => {
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
    <div className="device-item-card compact">
      <div className="device-label">Berat Bayi</div>

      <div className="device-value-wrapper">
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="3.2"
          value={data?.weight || ""}
          onChange={(e) => updateWeight("weight", e.target.value)}
          className="device-manual-input"
        />

        <span className="device-unit">Kg</span>
      </div>
    </div>
  );
}
