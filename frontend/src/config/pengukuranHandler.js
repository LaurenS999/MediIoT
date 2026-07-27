import { handleBMI } from "../helpers/pengukuranhandler/handleBMI";
import { handleTensi } from "../helpers/pengukuranhandler/handleTensi";
import { handleTemperatur } from "../helpers/pengukuranhandler/handleTemperatur";
import { handleOxy } from "../helpers/pengukuranhandler/handleOxy";
import { handleTimbangan_bayi } from "../helpers/pengukuranhandler/handleTimbanganBayi";
import { handleIDA } from "../helpers/pengukuranhandler/handleIDA";

// ======================================================
// CHECK DATA
// ======================================================
const hasData = (device) => {
  if (!device) return false;

  return Object.values(device).some(
    (value) => value !== null && value !== undefined && value !== "",
  );
};

// ======================================================
// DEVICE MAPPING
// ======================================================
export const deviceHandlerMap = {
  digitpro_bmi: handleBMI,
  digitpro_baby: handleTimbangan_bayi,
  digitpro_ida: handleIDA,
  tensione: handleTensi,
  mft01: handleTemperatur,
  pulse_oximeter: handleOxy,
};

// ======================================================
// MAIN SAVE FUNCTION
// ======================================================
export const simpanSemuaPengukuran = async ({
  devices,
  id_pengukuran,
  bmiResult,
  tinggiBadan,
}) => {
  const hasil = {
    success: [],
    failed: [],
    skipped: [],
  };

  // ======================================================
  // LOOP DEVICE
  // ======================================================
  for (const device of devices) {
    try {
      // ======================================================
      // SKIP JIKA DATA KOSONG
      // ======================================================
      if (!hasData(device)) {
        hasil.skipped.push({
          device: device.device_function,
          reason: "Data kosong",
        });

        continue;
      }

      // ======================================================
      // AMBIL HANDLER
      // ======================================================
      const handler = deviceHandlerMap[device.device_function];

      // ======================================================
      // JIKA HANDLER BELUM ADA
      // ======================================================
      if (!handler) {
        hasil.skipped.push({
          device: device.device_function,
          reason: "Handler belum tersedia",
        });

        continue;
      }

      // ======================================================
      // EXECUTE HANDLER
      // ======================================================
      await handler({
        id_pengukuran,
        dataAlat: device,
        bmiResult,
        tinggiBadan,
      });

      // ======================================================
      // SUCCESS
      // ======================================================
      hasil.success.push({
        device: device.device_function,
      });
    } catch (error) {
      console.error(error);

      // ======================================================
      // FAILED
      // ======================================================
      hasil.failed.push({
        device: device.device_function,
        error: error.response?.data?.message,
      });
    }
  }

  return hasil;
};
