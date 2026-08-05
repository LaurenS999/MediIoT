import { useState } from "react";
import { toast } from "react-toastify";

import { createPengukuran } from "../services/pengukuranService";
import { simpanSemuaPengukuran } from "../config/pengukuranHandler";
import { useModalInfo } from "../context/ModalInfoProvider";
import { createpemeriksaan } from "../services/pemeriksaanService";
import { createKunjungan } from "../services/kunjunganService";
import { useAuth } from "../context/AuthContext";
import { createSimpanKunjungan } from "../services/simpanKunjungan";
import { patchPendaftaranSelesai } from "../services/permintaanPemeriksaanService";

export default function useSavePengukuran() {
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const { showModal } = useModalInfo();
  const [keluhan, setKeluhan] = useState("");
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState({});
  const { user } = useAuth();

  const savePengukuran = async ({
    patient,
    devices,
    liveData,
    bmiResult,
    tinggiBadan,
    keluhan,
    catatanPemeriksaan,
    id_pendaftaran = "",
    draftLampiran,
    id_permintaan_pemeriksaan,
    waktu_kunjungan_awal,
  }) => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      // VALIDASI
      const newErrors = {};

      if (!keluhan) {
        newErrors.keluhan = "Keluhan wajib diisi";
      }

      if (!catatanPemeriksaan) {
        newErrors.catatanPemeriksaan = "Catatan Pemeriksaan wajib diisi";
      }

      if (Object.keys(newErrors).length > 0) {
        setError(newErrors);

        toast.warning("Data tidak boleh kosong");
        return;
      }

      let message = "";

      // =====================================
      // GET USER LOGIN
      // =====================================
      const userStorage = localStorage.getItem("user");
      const parsedUser = JSON.parse(userStorage);
      const id_user = parsedUser?.id_user;

      //BUAT FORM UNTUK DIKIRIM KE BACKEND
      const formData = new FormData();

      formData.append("patient", JSON.stringify(patient));
      formData.append("devices", JSON.stringify(devices));
      formData.append("liveData", JSON.stringify(liveData));
      formData.append("bmiResult", JSON.stringify(bmiResult));
      formData.append("tinggiBadan", tinggiBadan);
      formData.append("keluhan", keluhan);
      formData.append("catatanPemeriksaan", catatanPemeriksaan);
      formData.append("waktu_kunjungan_awal", waktu_kunjungan_awal);

      draftLampiran.forEach((item) => {
        formData.append("files", item.file);
        formData.append("kategori", item.kategori);
      });

      // CREATE SESI PEMERIKSAAN, SESI PENGUKURAN, dan KUNJUNGAN
      const respon = await createSimpanKunjungan(formData);

      const id_pengukuran = respon.data.data.id_pengukuran;

      message += `${respon.data.message} \n`;

      if (respon.data.data.lampiran.berhasil === true) {
        message += `Data Lampiran berhasil disimpan \n`;
      }
      // ======================================
      // NORMALIZE PAYLOAD PER DEVICE
      // ======================================
      if (devices.length > 0) {
        const payloadDevices = devices.map((device) => {
          const key = device.mac_address;
          const rawData = liveData[key];
          const data = Array.isArray(rawData) ? rawData[0] : rawData;

          let payload = {
            device_function: device.device_function,
            mac_address: data?.mac || device.mac_address || null,
            gateway_sn: device.gateway_id,
          };

          // =====================================
          // BMI
          // =====================================
          if (device.device_function === "digitpro_bmi") {
            payload.weight = data?.weight || null;
            payload.impedance = data?.impedance || null;
            payload.height = data?.height || null;
            payload.tinggi_badan = tinggiBadan || null;
          }

          // =====================================
          // Baby
          // =====================================
          if (device.device_function === "digitpro_baby") {
            payload.weight = data?.weight || null;
          }

          // =====================================
          // IDA
          // =====================================
          if (device.device_function === "digitpro_ida") {
            payload.weight_mother = data?.weight_mother || null;

            payload.weight_baby = data?.weight_baby || null;
          }

          // =====================================
          // TEMPERATUR
          // =====================================
          if (device.device_function === "mft01") {
            payload.temperature = data?.temperature || null;
          }

          // =====================================
          // TENSIONE
          // =====================================
          if (device.device_function === "tensione") {
            payload.systolic = data?.systolic || null;
            payload.diastolic = data?.diastolic || null;
            payload.pulse_rate = data?.pulse_rate || null;
            payload.spo2 = data?.spo2 || null;
            payload.map = data?.map || null;
            payload.user_type = data?.user_type || null;
            payload.error_status = data?.error_status || null;
          }

          // =====================================
          // OXYMETER
          // =====================================
          if (device.device_function === "pulse_oximeter") {
            payload.spo2 = data?.spo2 || null;
            payload.pulse_rate = data?.pulse_rate || null;
          }
          return payload;
        });
        // ======================================
        // SIMPAN SEMUA
        // ======================================
        const hasil = await simpanSemuaPengukuran({
          id_pengukuran,
          devices: payloadDevices,
          bmiResult,
          tinggiBadan,
        });

        const totalSuccess = hasil.success.length;
        const totalFailed = hasil.failed.length;
        const totalSkipped = hasil.skipped.length;

        if (totalSuccess > 0) {
          message += `${totalSuccess} data alat pengukuran berhasil disimpan\n`;
        }

        if (totalFailed > 0) {
          message += `${totalFailed} data alat pengukuran gagal disimpan\n`;
        }

        if (totalSkipped > 0) {
          message += `${totalSkipped} data alat pengukuran dilewati\n`;
        }

        if (hasil.failed.length > 0) {
          message += "\nDetail Error:\n";
          hasil.failed.forEach((item) => {
            message += `- ${item.device}: ${item.error}\n`;
          });
        }
      }

      showModal(message);

      setOpen(false);
      setIsSaved(true);
      return message;
    } catch (error) {
      showModal(error.response?.data?.message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    savePengukuran,

    activeSessionId,
    isSaving,
    isSaved,
    setIsSaving,
    setIsSaved,
    open,
    setOpen,
    catatan,
    setCatatan,
    keluhan,
    setKeluhan,
    error,
    setError,
  };
}
