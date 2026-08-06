export const transformTrendData = (data, keys) => {
  return data.map((item) => {
    const transformed = {
      tanggal: item.dibuat_pada,
    };

    keys.forEach((key) => {
      transformed[key] = item[key];
    });

    return transformed;
  });
};
