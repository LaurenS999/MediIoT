import React from "react";

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

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="tanggal" />

          <YAxis />

          <Tooltip />

          <Legend />

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
