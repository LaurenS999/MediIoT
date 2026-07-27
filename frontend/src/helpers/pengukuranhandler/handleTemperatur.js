import { createTemperatur } from "../../services/device/TemperaturService";
// ======================================================
// HANDLER TEMPERATURE
// ======================================================
export const handleTemperatur = async ({ id_pengukuran, dataAlat }) => {
  await createTemperatur({
    id_pengukuran,
    suhu: dataAlat?.temperature,
    payload_asli: dataAlat,
    mac: dataAlat.mac_address,
    id_gateway: dataAlat.gateway_sn,
  });
};
