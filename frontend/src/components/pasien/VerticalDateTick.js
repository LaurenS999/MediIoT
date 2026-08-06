const VerticalDateTick = ({ x, y, payload }) => {
  const date = new Date(payload.value);

  const day = date.toLocaleDateString("id-ID", {
    day: "2-digit",
  });

  const month = date.toLocaleDateString("id-ID", {
    month: "short",
  });

  const year = date.getFullYear();

  return (
    <g transform={`translate(${x}, ${y})`}>
      <text textAnchor="middle" fill="#666" fontSize={12}>
        <tspan x="0" dy="0">
          {day}
        </tspan>

        <tspan x="0" dy="14">
          {month}
        </tspan>

        <tspan x="0" dy="14">
          {year}
        </tspan>
      </text>
    </g>
  );
};

export default VerticalDateTick;
