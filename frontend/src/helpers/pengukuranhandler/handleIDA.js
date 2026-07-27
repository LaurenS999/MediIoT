import { createTimbangan_IDA } from "../../services/device/timbanganIDAService";
// ======================================================
// HANDLER IDA
// ======================================================
export const handleIDA = async ({ id_pengukuran, dataAlat }) => {
  await createTimbangan_IDA({
    id_pengukuran,
    berat_ibu: dataAlat?.weight_mother,
    berat_bayi: dataAlat?.weight_baby,
    payload_asli: dataAlat,
    mac: dataAlat.mac_address,
    id_gateway: dataAlat.gateway_sn,
  });
};
