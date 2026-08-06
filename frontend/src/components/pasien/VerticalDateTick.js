const VerticalDateTick = ({ x, y, payload }) => {
  const date = new Date(payload.value);

  const day = date.toLocaleDateString("id-ID", { day: "2-digit" });
  const month = date.toLocaleDateString("id-ID", { month: "short" });
  const year = date.getFullYear();

  return (
    // Gunakan y + 8 agar tidak terlalu jauh ke bawah
    <g transform={`translate(${x}, ${y + 8})`}>
      <text textAnchor="middle" fill="#666" fontSize={11}>
        <tspan x="0" dy="0">
          {day}
        </tspan>
        <tspan x="0" dy="12">
          {month}
        </tspan>
        <tspan x="0" dy="12">
          {year}
        </tspan>
      </text>
    </g>
  );
};

export default VerticalDateTick;
