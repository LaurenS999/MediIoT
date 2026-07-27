import { Hourglass, X } from "lucide-react";
import { error_status_klasifikasi } from "../../utils/errorStatus";

export default function CardTensi({ data, setLiveData, device }) {
  // =====================================================
  // UPDATE DATA
  // =====================================================
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

        // MAP harus dihapus jika systolic atau diastolic dihapus
        if (field === "systolic" || field === "diastolic") {
          delete currentData.map;
        }

        // Cek apakah masih ada data selain mac dan metadata
        const hasMeasurementData = Object.keys(currentData).some(
          (key) =>
            key !== "mac" &&
            key !== "device_function" &&
            key !== "error_status" &&
            key !== "user_type",
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

      // Hitung MAP otomatis
      const sys = Number(currentData.systolic || "");
      const dia = Number(currentData.diastolic || "");

      if (sys > 0 && dia > 0) {
        currentData.map = Math.round((sys + 2 * dia) / 3);
      } else {
        delete currentData.map;
      }

      return {
        ...prev,
        [macAddress]: currentData || "",
      };
    });
  };

  // =====================================================
  // ERROR STATUS DARI ALAT
  // =====================================================
  // if (data.error_status && data.error_status !== 1) {
  //   const errorKlasifikasi = error_status_klasifikasi(data.error_status);

  //   return (
  //     <div className="device-waiting">
  //       <X size={26} />
  //       Error Status : {data.error_status} ({errorKlasifikasi})
  //     </div>
  //   );
  // }

  return (
    <div className="device-grid-tensi">
      {/* ===================================== */}
      {/* SISTOLIK */}
      {/* ===================================== */}
      <div className="device-item-card">
        <div className="device-label">Sistolik</div>

        <div className="device-value-wrapper">
          <input
            type="number"
            placeholder={"120"}
            value={data?.systolic || ""}
            onChange={(e) => updateData("systolic", e.target.value)}
            className="device-manual-input"
          />

          <span className="device-unit">mmHg</span>
        </div>
      </div>

      {/* ===================================== */}
      {/* DIASTOLIK */}
      {/* ===================================== */}
      <div className="device-item-card">
        <div className="device-label">Diastolik</div>

        <div className="device-value-wrapper">
          <input
            type="number"
            placeholder={"80"}
            value={data?.diastolic || ""}
            onChange={(e) => updateData("diastolic", e.target.value)}
            className="device-manual-input"
          />

          <span className="device-unit">mmHg</span>
        </div>
      </div>

      {/* ===================================== */}
      {/* MAP */}
      {/* ===================================== */}
      <div className="device-item-card">
        <div className="device-label">MAP</div>

        <div className="device-value-wrapper">
          <span className="device-value color-blue">{data?.map || "-"}</span>

          <span className="device-unit">mmHg</span>
        </div>
      </div>

      {/* ===================================== */}
      {/* PULSE */}
      {/* ===================================== */}
      <div className="device-item-card">
        <div className="device-label">Pulse</div>

        <div className="device-value-wrapper">
          <input
            type="number"
            placeholder={"75"}
            value={data?.pulse_rate || ""}
            onChange={(e) => updateData("pulse_rate", e.target.value)}
            className="device-manual-input"
          />

          <span className="device-unit">bpm</span>
        </div>
      </div>

      {/* ===================================== */}
      {/* SPO2 */}
      {/* ===================================== */}
      <div className="device-item-card">
        <div className="device-label">SpO2</div>

        <div className="device-value-wrapper">
          <input
            type="number"
            min="0"
            max="100"
            placeholder={"98"}
            value={data?.spo2 || ""}
            onChange={(e) => updateData("spo2", e.target.value)}
            className="device-manual-input"
          />

          <span className="device-unit">%</span>
        </div>
      </div>
    </div>
  );
}
