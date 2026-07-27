import { pengukuranSocketMap } from "../../config/pengukuranSocketMap";

const displayValue = (value, suffix = "") => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return `${value}${suffix}`;
};

const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;

  return path.split(".").reduce((current, key) => {
    return current?.[key];
  }, obj);
};

export default function RingkasanPengukuranCard({ device, data, bmiResult }) {
  const config = pengukuranSocketMap[device.device_function];

  return (
    <div className="summary-measurement-item">
      <h4>{device.name}</h4>

      {config.summaryFields.map((field) => {
        const value =
          field.source === "bmiResult"
            ? getNestedValue(bmiResult, field.valuePath)
            : data?.[field.key];

        const label = field.labelPath
          ? getNestedValue(bmiResult, field.labelPath)
          : null;

        return (
          <div key={field.label} className="summary-item-row">
            <span>{field.label}</span>

            <strong>
              {displayValue(value, field.suffix)}
              {label ? ` (${label})` : ""}
            </strong>
          </div>
        );
      })}
    </div>
  );
}
