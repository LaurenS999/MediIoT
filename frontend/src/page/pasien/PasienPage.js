import React from "react";

import { useNavigate } from "react-router-dom";

import "../../styles/pasien.css";

import { Plus, Search } from "lucide-react";

import { usePasien } from "../../hooks/usePasien";

import { hitungUmur } from "../../utils/hitungUmur";

import ModalTambahPasien from "../../components/pasien/TambahModal";

import { Jenis_Kelamin } from "../../utils/jenisKelaminUtils";

import { formatDateTime } from "../../utils/formatDate";
import { useAuth } from "../../context/AuthContext";

import { getPaginationItems } from "../../utils/pagination";
import Pagination from "../../components/common/Pagination";

export default function PasienPage() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const {
    pasien,
    search,
    setSearch,
    openModal,
    setOpenModal,
    newPasien,
    setNewPasien,
    handleTambahPasien,
    errors,
    setErrors,
    currentPage,
    setCurrentPage,
    totalPage,
  } = usePasien(user?.id_user);

  const page = getPaginationItems(currentPage, totalPage);

  // ======================================================
  // NAVIGATE
  // ======================================================
  const handleRowClick = (pasien) => {
    navigate(`/pasien/${pasien.id_pasien}`);
  };

  return (
    <div className="setup-container">
      {/* ====================================================== */}
      {/* SEARCH */}
      {/* ====================================================== */}
      <div className="card-custom">
        <div className="search-button-wrapper">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />

            <input
              type="text"
              placeholder="Cari Nama atau ID Pasien..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {hasRole(user?.role, ["perawat", "super admin"]) && (
            <button
              className="btn-primary"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              <Plus size={18} />
              Tambah Pasien
            </button>
          )}
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
                <th>Kode Pasien</th>
                <th>Nama</th>
                <th>Umur</th>
                <th className="th-center">Jenis Kelamin</th>
                <th>No Telp</th>
                <th>Tanggal Berkunjung Terakhir</th>
              </tr>
            </thead>

            <tbody>
              {pasien.map((item, index) => (
                <tr
                  key={item.id_pasien}
                  onClick={() => handleRowClick(item)}
                  className="modern-row"
                >
                  <td>{index + 1}</td>
                  <td>
                    <div className="table-id-text">{item.kode_pasien}</div>
                  </td>
                  <td>
                    <div className="table-name-text">{item.nama}</div>
                  </td>
                  <td>{hitungUmur(item.tanggal_lahir)} Thn</td>

                  <td className="td-center">
                    <span
                      className={`
                        badge
                        ${item.jenis_kelamin === "L" ? "male" : "female"}
                      `}
                    >
                      {Jenis_Kelamin(item.jenis_kelamin)}
                    </span>
                  </td>
                  <td>{item.no_telp || "-"}</td>
                  <td>{formatDateTime(item.kunjungan_terakhir)}</td>
                </tr>
              ))}

              {pasien.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-table">
                    Data pasien tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          pages={page}
          totalPages={totalPage}
        />
      </div>

      {/* ====================================================== */}
      {/* MODAL */}
      {/* ====================================================== */}
      <ModalTambahPasien
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setNewPasien([]);
        }}
        onSave={handleTambahPasien}
        newPasien={newPasien}
        setNewPasien={setNewPasien}
        errors={errors}
        seterror={setErrors}
      />
    </div>
  );
}
