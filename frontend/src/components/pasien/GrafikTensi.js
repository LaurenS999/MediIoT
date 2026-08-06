import React from "react";
import VerticalDateTick from "./VerticalDateTick";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
export default function GrafikTensi({ title, data }) {
  return (
    <div className="trend-card">
      <div className="trend-card-header">
        <h3>{title}</h3>
      </div>

      {/* Ubah height dari 280 ke 320 */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 15, left: -20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="tanggal"
            interval={0}
            height={60}
            tick={<VerticalDateTick />}
          />

          <YAxis />
          <Tooltip />

          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: "10px" }}
          />

          <Line
            type="monotone"
            dataKey="systolic"
            stroke="#dc2626"
            strokeWidth={3}
            name="Systolic"
          />

          <Line
            type="monotone"
            dataKey="diastolic"
            stroke="#2563eb"
            strokeWidth={3}
            name="Diastolic"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
