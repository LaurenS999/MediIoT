import {
  HeartPulse,
  Thermometer,
  Activity,
  Scale,
  Droplets,
  Bone,
  Dumbbell,
  BicepsFlexed,
  Flame,
} from "lucide-react";

import "../../styles/detailPengukuran.css";
import { formatDateTime } from "../../utils/formatDate";
import { getStatusColor } from "../../utils/formatWarnaBMI";

export default function DetailPengukuran({ data }) {
  // =========================================================
  // CARD
  // =========================================================
  const MetricCard = ({ icon: Icon, title, value, unit, label }) => {
    const active = value !== null && value !== undefined;

    return (
      <div
        className={`metric-card ${
          active ? "metric-active" : "metric-inactive"
        }`}
      >
        <div className="metric-header">
          <div className="metric-title-group">
            <div className="metric-icon">
              <Icon size={18} />
            </div>

            <span>{title}</span>
          </div>

          {label && (
            <div
              className="metric-label"
              style={{
                backgroundColor: `${getStatusColor(label)}20`,
                color: getStatusColor(label),
              }}
            >
              {label.toUpperCase()}
            </div>
          )}
        </div>

        <div className="metric-body">
          <div className="metric-value-row">
            <div className="metric-value">{active ? value : "--"}</div>
            {unit && <div className="metric-unit">{unit}</div>}
          </div>
        </div>
      </div>
    );
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="measurement-detail-wrapper">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}
      <div className="measurement-detail-header">
        <div>
          <h2>Hasil Pengukuran</h2>

          <p>Data pengukuran: {formatDateTime(data?.tanggal)}</p>
        </div>
      </div>

      {/* ===================================================== */}
      {/* VITAL SIGN */}
      {/* ===================================================== */}
      <div className="measurement-section-title">Vital Sign</div>

      <div className="metric-grid">
        <MetricCard
          icon={HeartPulse}
          title="Systolic"
          value={data?.vital?.systolic}
          unit="mmHg"
        />

        <MetricCard
          icon={HeartPulse}
          title="Diastolic"
          value={data?.vital?.diastolic}
          unit="mmHg"
        />

        <MetricCard
          icon={Activity}
          title="MAP"
          value={data?.vital?.map}
          unit="mmHg"
        />

        <MetricCard
          icon={HeartPulse}
          title="Denyut Nadi"
          value={data?.vital?.pulse}
          unit="bpm"
        />

        <MetricCard
          icon={Activity}
          title="SpO2"
          value={data?.vital?.spo2}
          unit="%"
        />

        <MetricCard
          icon={Thermometer}
          title="Suhu"
          value={data?.vital?.suhu}
          unit="°C"
        />
      </div>

      {/* ===================================================== */}
      {/* BODY MEASUREMENT */}
      {/* ===================================================== */}
      <div className="measurement-section-title">Body Measurement</div>

      <div className="metric-grid">
        <MetricCard
          icon={Scale}
          title="Berat Badan"
          value={data?.body?.berat}
          unit="kg"
        />

        <MetricCard
          icon={Scale}
          title="Tinggi Badan"
          value={data?.body?.tinggi}
          unit="cm"
        />
      </div>

      {/* ===================================================== */}
      {/* BODY COMPOSITION */}
      {/* ===================================================== */}
      <div className="measurement-section-title">Body Composition</div>

      <div className="composition-grid">
        <MetricCard
          icon={Scale}
          title="BMI"
          value={data?.composition?.bmi}
          unit=""
          label={data?.composition?.bmi_label}
        />

        <MetricCard
          icon={Droplets}
          title="Body Fat"
          value={data?.composition?.bodyFat}
          unit="%"
          label={data?.composition?.bodyFat_label}
        />

        <MetricCard
          icon={BicepsFlexed}
          title="Muscle Mass"
          value={data?.composition?.muscleMass}
          unit="kg"
          label={data?.composition?.muscleMass_label}
        />

        <MetricCard
          icon={Droplets}
          title="Water"
          value={data?.composition?.water}
          unit="%"
          label={data?.composition?.water_label}
        />

        <MetricCard
          icon={Activity}
          title="Visceral Fat"
          value={data?.composition?.visceralFat}
          unit=""
          label={data?.composition?.visceralFat_label}
        />

        <MetricCard
          icon={Bone}
          title="Bone"
          value={data?.composition?.bone}
          unit="kg"
          label={data?.composition?.bone_label}
        />

        <MetricCard
          icon={Flame}
          title="Metabolism"
          value={data?.composition?.metabolism}
          unit="kcal"
          label={data?.composition?.metabolism_label}
        />

        <MetricCard
          icon={Activity}
          title="Protein"
          value={data?.composition?.protein}
          unit="%"
          label={data?.composition?.protein_label}
        />

        <MetricCard
          icon={HeartPulse}
          title="Body Age"
          value={data?.composition?.bodyAge}
          unit="th"
        />

        <MetricCard
          icon={Dumbbell}
          title="LBM"
          value={data?.composition?.lbm}
          unit="kg"
        />
      </div>
    </div>
  );
}
