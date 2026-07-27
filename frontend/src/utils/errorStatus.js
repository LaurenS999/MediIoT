export function error_status_klasifikasi(error_status) {
  if (error_status === 1) {
    return "Normal";
  } else if (error_status === 2) {
    return "Pengukuran Gagal";
  } else if (error_status === 3) {
    return "Pengukuran Sendiri Gagal";
  } else if (error_status === 4) {
    return "Bateri Low";
  } else if (error_status === 5) {
    return "Pengukuran Dibatalkan";
  } else if (error_status === 6) {
    return "Manset Longgar";
  } else if (error_status === 7) {
    return "Kebocoran Udara";
  } else if (error_status === 8) {
    return "Kesalaahn Tekanan Udara";
  } else if (error_status === 9) {
    return "Diluar Jangkauan";
  } else if (error_status === 10) {
    return "Diluar Jangkauan";
  } else if (error_status === 11) {
    return "Lebih Dari Tekanan";
  } else if (error_status === 12) {
    return "Saturasi Sinyal";
  } else {
    return "Batas Waktu";
  }
}
