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

export default function GrafikTrend({ title, data, dataKey, color, unit }) {
  return (
    <div className="trend-card">
      <div className="trend-card-header">
        <h3>{title}</h3>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tanggal" interval={0} tick={<VerticalDateTick />} />

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
