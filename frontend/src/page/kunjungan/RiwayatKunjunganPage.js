import React, { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import "../../styles/riwayatPengukuran.css";
import { getPaginationItems } from "../../utils/pagination";
import {
  Activity,
  CalendarClock,
  Search,
  History,
  Download,
} from "lucide-react";

import { formatDateTime } from "../../utils/formatDate";

import Pagination from "../../components/common/Pagination";

import { exportLaporanPengukuran } from "../../services/laporanService";
import { useAuth } from "../../context/AuthContext";

import { useKunjungan } from "../../hooks/useKunjungan";
import { toast } from "react-toastify";

export default function RiwayatKunjunganPage() {
  const navigate = useNavigate();

  const {
    kunjungan,
    currentPage,
    setCurrentPage,
    totalPage,
    search,
    setSearch,
  } = useKunjungan();

  const page = getPaginationItems(currentPage, totalPage);

  const { user } = useAuth();

  const handleExport = async () => {
    try {
      // ambil user login

      const response = await exportLaporanPengukuran(user.id_user);

      // convert jadi file
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      // buat url download
      const url = window.URL.createObjectURL(blob);

      // element download
      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `laporan-pengukuran-terakhir-setiap-pasien-${Date.now()}.xlsx`,
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      // bersihkan memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  // =====================================================
  // DETAIL
  // =====================================================
  const handleRowClick = (item) => {
    navigate(`/pasien/${item.id_pasien}`);
  };

  return (
    <div className="history-page-container">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}
      <div className="history-page-header">
        <div>
          <h1 className="history-page-title">Riwayat Kunjungan</h1>

          <p className="history-page-subtitle">
            Monitoring hasil pengukuran pasien
          </p>
        </div>

        <button className="export-button" onClick={handleExport}>
          <Download size={18} />
          Export Laporan
        </button>
      </div>

      {/* ===================================================== */}
      {/* SEARCH */}
      {/* ===================================================== */}
      <div className="card-custom">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />

          <input
            type="text"
            placeholder="Cari kode sesi, pasien, atau user..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}
      <div className="card-custom">
        <div className="table-wrapper-modern">
          <table className="modern-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Kode Sesi</th>
                <th>Nama Pasien</th>
                <th className="th-center">Jenis Kelamin</th>
                <th>Perawat</th>
                <th>Dokter</th>
                <th>Tanggal Kunjungan</th>
              </tr>
            </thead>

            <tbody>
              {kunjungan.map((item, index) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className="modern-row"
                >
                  <td>{index + 1}</td>

                  {/* KODE SESI */}
                  <td>
                    <div className="table-id-text">{item.kode_kunjungan}</div>
                  </td>

                  {/* PASIEN */}
                  <td>
                    <div className="table-name-text">{item.nama}</div>
                  </td>

                  {/* GENDER */}
                  <td className="td-center">
                    <span
                      className={`gender-badge-history ${
                        item.jenis_kelamin === "L" ? "male" : "female"
                      } `}
                    >
                      {item.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                    </span>
                  </td>

                  {/* Perawat */}
                  <td>
                    <div className="table-name-text">{item.nama_perawat}</div>
                  </td>
                  {/* Dokter */}
                  <td>
                    <div className="table-name-text">{item.nama_dokter}</div>
                  </td>
                  {/* DATE */}
                  <td>
                    <div>
                      <CalendarClock size={15} />

                      {formatDateTime(item.tanggal_kunjungan)}
                    </div>
                  </td>
                </tr>
              ))}

              {/* EMPTY */}
              {kunjungan.length === 0 && (
                <tr>
                  <td colSpan="6" className="history-empty">
                    Data riwayat pengukuran tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* PAGINATION */}
          <div className="pagination-wrapper">
            <Pagination
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
              pages={page}
              totalPages={totalPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
