import { formatTanggalIndonesia } from "./formatTanggal";

export const transformTrendData = (data, keys) => {
  return data.map((item) => {
    const transformed = {
      tanggal: formatTanggalIndonesia(item.dibuat_pada),
    };

    keys.forEach((key) => {
      transformed[key] = item[key];
    });

    return transformed;
  });
};
