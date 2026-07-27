import { Hourglass } from "lucide-react";
import { removeDeviceIfEmpty } from "../../helpers/removeDeviceIfEmpty";
export default function CardTermometer({ data, setLiveData, device }) {
  // =====================================
  // UPDATE DATA
  // =====================================
  const updateTemperature = (field, value) => {
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
      <div className="device-item-card compact">
        <div className="device-label">Temperatur</div>

        <div className="device-value-wrapper">
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder={"36.5"}
            value={data?.temperature ?? ""}
            onChange={(e) => updateTemperature("temperature", e.target.value)}
            className="device-manual-input"
          />

          <span className="device-unit">°C</span>
        </div>

        {!data && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#999",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Hourglass size={14} />
            Menunggu data temperatur...
          </div>
        )}
      </div>
    </div>
  );
}
