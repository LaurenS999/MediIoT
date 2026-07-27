import { createOxy } from "../../services/device/OxymeterService";
// ======================================================
// HANDLER OXYMETER
// ======================================================
export const handleOxy = async ({ id_pengukuran, dataAlat }) => {
  await createOxy({
    id_pengukuran,
    spo2: dataAlat?.spo2,
    denyut_nadi: dataAlat?.pulse_rate,
    payload_asli: dataAlat,
    mac: dataAlat.mac_address,
    id_gateway: dataAlat.gateway_sn,
  });
};
