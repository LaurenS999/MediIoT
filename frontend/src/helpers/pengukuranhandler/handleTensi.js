import { createTensi } from "../../services/device/TensiService";
// ======================================================
// HANDLER TENSI
// ======================================================
export const handleTensi = async ({ id_pengukuran, dataAlat }) => {
  await createTensi({
    id_pengukuran,
    systolic: dataAlat?.systolic,
    diastolic: dataAlat?.diastolic,
    map: dataAlat?.map,
    denyut_nadi: dataAlat?.pulse_rate,
    spo2: dataAlat?.spo2,
    tipe_pasien: dataAlat?.user_type,
    error_status: dataAlat?.error_status,
    payload_asli: dataAlat,
    mac: dataAlat.mac_address,
    id_gateway: dataAlat.gateway_sn,
  });
};
