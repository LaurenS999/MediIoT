import { formatTanggalIndonesia } from "./formatTanggal";

export const transformTrendData = (data, keys) => {
  console.log("DATA :", data);
  console.log("TYPE :", typeof data);
  console.log("ARRAY :", Array.isArray(data));

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
