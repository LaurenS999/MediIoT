import { createTimbangan_Bayi } from "../../services/device/timbanganBayiService";
// ======================================================
// HANDLER TIMBANGAN BAYI
// ======================================================
export const handleTimbangan_bayi = async ({ id_pengukuran, dataAlat }) => {
  await createTimbangan_Bayi({
    id_pengukuran,
    berat: dataAlat?.weight,
    payload_asli: dataAlat,
    mac: dataAlat.mac_address,
    id_gateway: dataAlat.gateway_sn,
  });
};
