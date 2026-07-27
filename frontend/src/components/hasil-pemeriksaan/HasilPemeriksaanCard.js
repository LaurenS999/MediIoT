import { getStatusColor } from "../../utils/formatWarnaBMI";
export default function HasilPemeriksaanCard({ title, value, unit, status }) {
  return (
    <div className="hasil-card">
      <div className="hasil-card-title">{title}</div>

      <div className="hasil-card-value">
        {value}
        {unit && <span className="hasil-card-unit"> {unit}</span>}
      </div>

      {status && (
        <div
          style={{
            backgroundColor: `${getStatusColor(status)}20`,
            color: getStatusColor(status),
          }}
          className="hasil-card-status"
        >
          {status}
        </div>
      )}
    </div>
  );
}
