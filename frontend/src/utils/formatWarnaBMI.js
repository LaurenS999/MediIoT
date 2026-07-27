// ======================================================
  // COLOR STATUS
  // ======================================================
  export const getStatusColor = (status) => {

    if (!status) return "#999";

    const s = status.toLowerCase();

    if (
      s === "healthy" ||
      s === "excellent"
    ) {
      return "#22c55e";
    }

    if (
      s === "slim" ||
      s === "low"
    ) {
      return "#06b6d4";
    }

    if (s === "over") {
      return "#f59e0b";
    }

    if (
      s === "obese" ||
      s === "high"
    ) {
      return "#ef4444";
    }

    return "#999";
  };