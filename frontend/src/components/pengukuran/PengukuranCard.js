import { deviceConfig } from "../../config/deviceConfig";

export default function PengukuranCard({
  mode,
  device,
  dataAlat,
  tinggiBadan,
  setTinggiBadan,
  bmiResult,

  setLiveData,
}) {
  const config = deviceConfig[device.device_function];

  const Icon = config?.icon;

  const DeviceComponent = config?.component;

  // =====================================
  // REALTIME
  // =====================================
  const realtimeData = Array.isArray(dataAlat) ? dataAlat[0] : dataAlat;

  const realtimeMac = realtimeData?.mac;

  // =====================================
  // BMI FULL CARD
  // =====================================
  const isBMI = device.model === "digitpro_bmi";

  // =====================================
  // RENDER
  // =====================================
  return (
    <div className={`card-custom ${isBMI ? "card-full" : ""}`}>
      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}
      <div className="card-title">
        {/* LEFT */}
        <div>
          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: "8px",
            }}
          >
            {Icon && <Icon size={18} />}

            <span>{config?.label || "Unknown Device"}</span>
          </div>

          <small>
            {realtimeMac ||
              device.mac_address ||
              device.ip_address ||
              "Tidak Terdeteksi"}
          </small>
        </div>
      </div>

      {/* ===================================== */}
      {/* CONTENT */}
      {/* ===================================== */}
      <div className="device-grid-inner">
        {DeviceComponent ? (
          <DeviceComponent
            data={dataAlat}
            tinggiBadan={tinggiBadan}
            setTinggiBadan={setTinggiBadan}
            bmiResult={bmiResult}
            setLiveData={setLiveData}
            device={device}
          />
        ) : (
          <div
            style={{
              padding: "20px",

              color: "#999",
            }}
          >
            Device belum support
          </div>
        )}
      </div>
    </div>
  );
}
