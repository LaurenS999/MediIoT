import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../../styles/detailPemeriksaanDokter.css";
import { usePemeriksaanDokterDetail } from "../../hooks/usePemeriksaanDokterDetail";
import { formatDateTime } from "../../utils/formatDate";
import { updatePemeriksaanDokter } from "../../services/pemeriksaanDokterService";
import { toast } from "react-toastify";

import { hasilPemeriksaanConfig } from "../../config/hasilPemeriksaanConfig";
import HasilPemeriksaanGroup from "../../components/hasil-pemeriksaan/HasilPemeriksaanGroup";
import HasilPemeriksaanCard from "../../components/hasil-pemeriksaan/HasilPemeriksaanCard";

import useLampiran from "../../hooks/useLampiran";

import LampiranPemeriksaan from "../../components/pemeriksaan-dokter/LampiranPemeriksaan";

import Lampiran from "../../components/lampiran/Lampiran";

export default function DetailPemeriksaanDokter() {
  const { id_kunjungan } = useParams();

  const { lampiran, previewImage, setPreviewImage } = useLampiran(id_kunjungan);

  const navigate = useNavigate();

  const { pasien, pemeriksaan, pengukuran } =
    usePemeriksaanDokterDetail(id_kunjungan);

  const [formData, setFormData] = useState({
    diagnosa: "",
    catatan_dokter: "",
    status_pasien: "",
  });

  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const hasData = (sectionKey) => {
    if (!pengukuran) return false;

    return hasilPemeriksaanConfig[sectionKey].items.some((item) => {
      const value = pengukuran[sectionKey]?.[item.key];

      return value !== null && value !== undefined;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.diagnosa) {
      newErrors.diagnosa = "diagnosa wajib diisi";
    }

    if (!formData.catatan_dokter) {
      newErrors.catatan_dokter = "Catatan Pemeriksaan wajib diisi";
    }
    if (formData.status_pasien == "") {
      newErrors.status_pasien = "Status Pasien wajib diisi";
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      toast.warning("Data tidak boleh kosong");
      return;
    }

    try {
      await updatePemeriksaanDokter(pemeriksaan.id_pemeriksaan, formData);

      toast.success("Pemeriksaan berhasil disimpan.");
      navigate("/pemeriksaan-dokter");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Terjadi kesalahan.");
    }
  };

  return (
    <div className="doctor-detail-wrapper">
      {/* ================================================ */}
      {/* HEADER */}
      {/* ================================================ */}

      <div className="doctor-detail-header">
        <h1>Pemeriksaan Dokter</h1>

        <p>Lengkapi hasil pemeriksaan dokter pasien.</p>
      </div>

      {/* ================================================ */}
      {/* DETAIL PASIEN */}
      {/* ================================================ */}

      <div className="doctor-card">
        <h2>Detail Pasien</h2>

        <div className="patient-detail-grid">
          <div className="patient-detail-item">
            <label>Nama Pasien</label>
            <p>{pasien.nama_pasien}</p>
          </div>

          <div className="patient-detail-item">
            <label>Kode Pasien</label>
            <p>{pasien.kode_pasien}</p>
          </div>

          <div className="patient-detail-item">
            <label>Perawat</label>
            <p>{pasien.nama_perawat}</p>
          </div>

          <div className="patient-detail-item">
            <label>Jenis Kelamin</label>
            <p>{pasien.jenis_kelamin}</p>
          </div>

          <div className="patient-detail-item">
            <label>Tanggal Lahir</label>
            <p>{formatDateTime(pasien.tanggal_lahir, false)}</p>
          </div>

          <div className="patient-detail-item">
            <label>Tanggal Pemeriksaan</label>
            <p>{formatDateTime(pemeriksaan.dibuat_pada)}</p>
          </div>
        </div>
      </div>

      {/* ================================================ */}
      {/* PEMERIKSAAN AWAL */}
      {/* ================================================ */}

      <div className="doctor-card">
        <h2>Pemeriksaan Awal</h2>

        <div className="doctor-form-group">
          <label>Keluhan</label>

          <textarea
            className="doctor-textarea"
            value={pemeriksaan.keluhan}
            disabled
          />
        </div>

        <div className="doctor-form-group">
          <label>Catatan Perawat</label>

          <textarea
            className="doctor-textarea"
            value={pemeriksaan.catatan_perawat}
            disabled
          />
        </div>
      </div>

      {/* ================================================ */}
      {/* HASIL PENGUKURAN */}
      {/* ================================================ */}

      {Object.entries(hasilPemeriksaanConfig).map(([sectionKey, section]) => {
        if (!hasData(sectionKey)) return null;

        return (
          <HasilPemeriksaanGroup key={sectionKey} title={section.title}>
            {section.items
              .filter((item) => {
                const value = pengukuran[sectionKey]?.[item.key];

                return value !== null && value !== undefined;
              })
              .map((item) => (
                <HasilPemeriksaanCard
                  key={item.key}
                  title={item.label}
                  value={pengukuran[sectionKey][item.key]}
                  unit={item.unit}
                  status={
                    item.statusKey
                      ? pengukuran[sectionKey][item.statusKey]
                      : null
                  }
                />
              ))}
          </HasilPemeriksaanGroup>
        );
      })}

      <div className="card-custom ">
        <Lampiran files={lampiran} canAdd={false} canDelete={false} />
      </div>
      {/* <LampiranPemeriksaan
        lampiran={lampiran}
        setPreviewImage={setPreviewImage}
      /> */}

      {/* ================================================ */}
      {/* PEMERIKSAAN DOKTER */}
      {/* ================================================ */}

      <form className="doctor-card" onSubmit={handleSubmit}>
        <h2>Pemeriksaan Dokter</h2>

        <div className="doctor-form-group">
          <label>
            Diagnosa <span className="required-mark"> *</span>
          </label>

          <textarea
            className={
              error.diagnosa ? "doctor-textarea input-error" : "doctor-textarea"
            }
            name="diagnosa"
            value={formData.diagnosa}
            onChange={handleChange}
            rows={3}
            placeholder='Masukkan diagnosa. Jika tidak ada diagnosa, tuliskan "Tidak ada".'
          />
        </div>

        <div className="doctor-form-group">
          <label>
            Status Pasien
            <span className="required-mark"> *</span>
          </label>

          <select
            className={
              error.status_pasien
                ? "doctor-select input-error"
                : "doctor-select"
            }
            name="status_pasien"
            value={formData.status_pasien}
            onChange={handleChange}
          >
            <option value="">Pilih Status Pasien</option>

            <option value="fit to work">Fit to Work</option>

            <option value="fit with note">Fit with Note</option>

            <option value="unfit">UnFit</option>

            <option value="unfit temporary">UnFit Temporary</option>
          </select>
        </div>

        <div className="doctor-form-group">
          <label>
            Catatan Pemeriksaan Akhir <span className="required-mark"> *</span>
          </label>

          <textarea
            className={
              error.catatan_dokter
                ? "doctor-textarea input-error"
                : "doctor-textarea"
            }
            name="catatan_dokter"
            value={formData.catatan_dokter}
            onChange={handleChange}
            rows={4}
            placeholder='Masukkan catatan dokter. Jika tidak ada catatan dokter, tuliskan "Tidak ada".'
          />
        </div>

        <div className="doctor-action">
          <button type="submit" className="doctor-submit-btn">
            Simpan Pemeriksaan
          </button>
        </div>
      </form>
      {previewImage && (
        <div
          className="image-preview-overlay"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage.url}
            alt={previewImage.nama_file}
            className="image-preview"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
