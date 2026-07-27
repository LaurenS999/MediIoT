import React from "react";

import { useNavigate } from "react-router-dom";

import "../../styles/pasien.css";

import { Search } from "lucide-react";

import { formatDateTime } from "../../utils/formatDate";

import { getPaginationItems } from "../../utils/pagination";
import Pagination from "../../components/common/Pagination";

import { usePemeriksaanDokter } from "../../hooks/usePemeriksaanDokter";
import { truncateText } from "../../utils/truncateText";

export default function PemeriksaanDokterPage() {
  const navigate = useNavigate();

  const {
    pemeriksaanDokter,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    totalPage,
  } = usePemeriksaanDokter();

  const page = getPaginationItems(currentPage, totalPage);

  // ======================================================
  // NAVIGATE
  // ======================================================
  const handleRowClick = (data) => {
    navigate(`/pemeriksaan-dokter/${data.id_kunjungan}`);
  };

  return (
    <div className="setup-container">
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Daftar kunjungan yang Belum diperiksa Dokter
          </h1>

          <p className="page-subtitle">
            Kelola data pasien yang belum diperiksa dokter
          </p>
        </div>
      </div>

      {/* ====================================================== */}
      {/* SEARCH */}
      {/* ====================================================== */}
      <div className="card-custom">
        <div className="card-header-flex">
          <label className="label-header">Cari Pemeriksaan</label>
        </div>

        <div className="search-wrapper-modern">
          <Search size={18} className="search-icon" />

          <input
            type="text"
            placeholder="Cari Nama Pasien atau Nama Perawat..."
            className="search-input-modern"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ====================================================== */}
      {/* TABLE */}
      {/* ====================================================== */}
      <div className="card-custom">
        <div className="table-wrapper-modern">
          <table className="modern-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Pasien</th>
                <th>Nama Perawat</th>
                <th>Tanggal Pemeriksaan</th>
                <th>Keluhan</th>
                <th>Catatan Perawat</th>
              </tr>
            </thead>

            <tbody>
              {pemeriksaanDokter.map((item, index) => (
                <tr
                  key={item.kode_pemeriksaan}
                  onClick={() => handleRowClick(item)}
                  className="modern-row"
                >
                  <td>{index + 1}</td>
                  <td>
                    <div className="table-id-text">{item.nama}</div>
                  </td>

                  <td>
                    <div className="table-name-text">{item.nama_perawat}</div>
                  </td>

                  <td>{formatDateTime(item.tanggal_berkunjung)}</td>

                  <td>
                    <div className="table-name-text">
                      {truncateText(item.keluhan)}
                    </div>
                  </td>

                  <td>
                    <div className="table-name-text">
                      {truncateText(item.catatan_perawat)}
                    </div>
                  </td>
                </tr>
              ))}

              {pemeriksaanDokter.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-table">
                    Tidak ada Pemeriksaan Pasien.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
