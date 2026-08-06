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
} from "recharts";

export default function GrafikTrend({ title, data, dataKey, color }) {
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

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
