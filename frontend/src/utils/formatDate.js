export const formatDateTime = (dateString, status_jam = true) => {
  // =========================================
  // DEFAULT
  // =========================================
  if (!dateString) {
    return "00/00/0000 - 00:00";
  }

  const date = new Date(dateString);

  // =========================================
  // INVALID DATE
  // =========================================
  if (isNaN(date.getTime())) {
    return "00/00/0000 - 00:00";
  }

  const day = String(date.getDate()).padStart(2, "0");

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");

  const minutes = String(date.getMinutes()).padStart(2, "0");

  if (status_jam === false) {
    return `${day}/${month}/${year}`;
  }

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};
