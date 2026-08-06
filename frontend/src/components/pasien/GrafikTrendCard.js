import "../../styles/detailPemeriksaanCard.css";
import { formatDateTime } from "../../utils/formatDate";
import GrafikTensi from "../../components/pasien/GrafikTensi";
import GrafikTrend from "../../components/pasien/GrafikTrend";
import { transformTrendData } from "../../utils/formatTrend";

export function GrafikTrendCard({
  trendBerat,
  trendFat,
  trendMucle,
  trendTensi,
}) {
  console.log("TREND BERAT : ", trendBerat);
  console.log("TREND FAT : ", trendFat);
  console.log("TREND MUSCLE : ", trendMucle);
  console.log("TREND TENSI : ", trendTensi);
  return (
    <div className="trend-section">
      <div className="trend-header">
        <div>
          <h3 className="trend-title">Grafik Data Pasien</h3>

          <p className="trend-subtitle">Grafik perubahan Data pasien</p>
        </div>
      </div>

      <div className="trend-grid">
        <GrafikTrend
          title="Trend Berat Badan"
          data={transformTrendData(trendBerat, ["berat"])}
          dataKey="berat"
          color="#2563eb"
          unit="kg"
        />

        <GrafikTensi
          title="Trend Tekanan Darah"
          data={transformTrendData(trendTensi, ["systolic", "diastolic"])}
        />

        <GrafikTrend
          title="Trend Body Fat"
          data={transformTrendData(trendFat, ["body_fat"])}
          dataKey="body_fat"
          color="#dc2626"
          unit="%"
        />

        <GrafikTrend
          title="Trend Muscle Mass"
          data={transformTrendData(trendMucle, ["muscle_mass"])}
          dataKey="muscle_mass"
          color="#16a34a"
          unit="kg"
        />
      </div>
    </div>
  );
}
