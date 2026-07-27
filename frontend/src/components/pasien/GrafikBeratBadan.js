import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    tanggal: "01 Mei",
    berat_badan: 70.2,
  },
  {
    tanggal: "05 Mei",
    berat_badan: 69.8,
  },
  {
    tanggal: "10 Mei",
    berat_badan: 70.5,
  },
];

export default function GrafikBeratBadan() {
  return (
    <div className="grafik-container">
      <h3>Trend Berat Badan</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="tanggal" />

          <YAxis domain={["auto", "auto"]} unit=" kg" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="berat_badan"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
