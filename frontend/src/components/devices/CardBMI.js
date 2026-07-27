import React from "react";
import { getStatusColor } from "../../utils/formatWarnaBMI";

// ======================================================
// RANGE BAR MINI
// ======================================================
const RangeIndicator = ({ type, currentStatus, range = [] }) => {
  const categories = {
    obesity: ["slim", "healthy", "over", "obese"],
    excellent: ["low", "excellent", "high"],
    high: ["low", "healthy", "high"],
  };

  const activeCats = categories[type] || [];

  return (
    <div className="range-wrapper">
      <div className="range-bar-container">
        {activeCats.map((cat) => {
          const isActive = currentStatus?.trim().toLowerCase() === cat;

          return (
            <div
              key={cat}
              className={`
                range-segment
                ${cat}
                ${isActive ? "active" : "inactive"}
              `}
            />
          );
        })}
      </div>

      {range.length > 0 && (
        <div className="range-text">{range.join(" • ")}</div>
      )}
    </div>
  );
};

// ======================================================
// CARD BMI
// ======================================================
export default function CardBMI({
  data,
  tinggiBadan,
  setTinggiBadan,
  bmiResult,
  setLiveData,
  device,
}) {
  // ======================================================
  // DATA BERAT
  // ======================================================
  const berat = data?.weight ?? "";

  // ======================================================
  // UPDATE BERAT
  // ======================================================
  const updateBMI = (field, value) => {
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
          (key) =>
            key !== "mac" && key !== "impedance" && key !== "device_function",
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

      if (field == "weight") {
        currentData["impedance"] = 0;
      }

      return {
        ...prev,
        [macAddress]: currentData || "",
      };
    });

    // setLiveData((prev) => ({
    //   ...prev,

    //   [device.mac_address]: {
    //     ...(prev[device.mac_address] || {}),

    //     mac: device.mac_address,
    //     device_function: "digitpro_bmi",

    //     impedance:
    //       field === "weight" ? 0 : (prev?.[device.mac_address]?.impedance ?? 0),

    //     [field]: value === "" ? "" : Number(value),
    //   },
    // }));
  };

  // ======================================================
  // METRIC ITEM
  // ======================================================
  const MetricItem = ({
    label,
    value,
    unit = "",
    pangkat = null,
    status = null,
    type = null,
    range = [],
  }) => (
    <div className="metric-box compact">
      <div className="metric-label">{label}</div>

      <div className="metric-value compact">
        {value ?? "--"}

        <span className="metric-unit">
          {" "}
          {unit}
          <sup>{pangkat}</sup>
        </span>
      </div>

      {type && status ? (
        <>
          <RangeIndicator type={type} currentStatus={status} range={range} />

          <div
            className="badge"
            style={{
              backgroundColor: getStatusColor(status),
            }}
          >
            {status}
          </div>
        </>
      ) : (
        <div className="metric-placeholder" />
      )}
    </div>
  );

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="bmi-container">
      {/* ======================================================
          HEADER BMI
      ====================================================== */}
      <div className="bmi-top-section">
        {/* ===================================== */}
        {/* BERAT BADAN */}
        {/* ===================================== */}
        <div className="bmi-weight-box">
          <div className="height-label">Berat Badan</div>

          <div className="height-input-group">
            <input
              type="number"
              step="0.1"
              placeholder="70"
              value={berat}
              onChange={(e) => updateBMI("weight", e.target.value)}
              className="height-input compact"
            />

            <span className="height-unit">Kg</span>
          </div>
        </div>

        {/* ===================================== */}
        {/* TINGGI BADAN */}
        {/* ===================================== */}
        <div className="height-input-wrapper">
          <div className="height-label">Tinggi Badan</div>

          <div className="height-input-group">
            <input
              type="number"
              placeholder="170"
              value={tinggiBadan}
              onChange={(e) => setTinggiBadan(e.target.value)}
              className="height-input compact"
            />

            <span className="height-unit">cm</span>
          </div>
        </div>
      </div>

      {/* ======================================================
          GRID BMI
      ====================================================== */}
      <div className="bmi-secondary-grid compact">
        <MetricItem
          label="BMI"
          value={bmiResult?.data?.bmi?.value}
          status={bmiResult?.data?.bmi?.label}
          range={bmiResult?.data?.bmi?.range}
          type="obesity"
          unit="Kg/m"
          pangkat="2"
        />

        <MetricItem
          label="Body Fat"
          value={bmiResult?.data?.body_fat?.value}
          unit="%"
          status={bmiResult?.data?.body_fat?.label}
          range={bmiResult?.data?.body_fat?.range}
          type="obesity"
        />

        <MetricItem
          label="Visceral"
          value={bmiResult?.data?.visceral_fat?.value}
          status={bmiResult?.data?.visceral_fat?.label}
          range={bmiResult?.data?.visceral_fat?.range}
          type="obesity"
        />

        <MetricItem
          label="Muscle"
          value={bmiResult?.data?.muscle_mass?.value}
          unit="Kg"
          status={bmiResult?.data?.muscle_mass?.label}
          range={bmiResult?.data?.muscle_mass?.range}
          type="excellent"
        />

        <MetricItem
          label="Bone"
          value={bmiResult?.data?.bone?.value}
          unit="Kg"
          status={bmiResult?.data?.bone?.label}
          range={bmiResult?.data?.bone?.range}
          type="excellent"
        />

        <MetricItem
          label="Water"
          value={bmiResult?.data?.water?.value}
          unit="%"
          status={bmiResult?.data?.water?.label}
          range={bmiResult?.data?.water?.range}
          type="high"
        />

        <MetricItem
          label="Metabolism"
          value={bmiResult?.data?.metabolism?.value}
          unit="kcal"
          status={bmiResult?.data?.metabolism?.label}
          range={bmiResult?.data?.metabolism?.range}
          type="high"
        />

        <MetricItem
          label="Protein"
          value={bmiResult?.data?.protein?.value}
          unit="%"
          status={bmiResult?.data?.protein?.label}
          range={bmiResult?.data?.protein?.range}
          type="high"
        />

        <MetricItem
          label="Body Age"
          value={bmiResult?.data?.body_age?.value}
          unit="Thn"
        />

        <MetricItem label="LBM" value={bmiResult?.data?.lbm?.value} unit="Kg" />
      </div>
    </div>
  );
}
