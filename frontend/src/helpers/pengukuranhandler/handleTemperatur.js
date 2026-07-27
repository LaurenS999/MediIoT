import { createTemperatur } from "../../services/device/TemperaturService";
// ======================================================
// HANDLER TEMPERATURE
// ======================================================
export const handleTemperatur = async ({ id_pengukuran, dataAlat }) => {
  console.log("ID PENGUKURAN HANDLER TEMPERATUR : ", id_pengukuran);
  await createTemperatur({
    id_pengukuran,
    suhu: dataAlat?.temperature,
    payload_asli: dataAlat,
    mac: dataAlat.mac_address,
    id_gateway: dataAlat.gateway_sn,
  });
};
