import React from "react";

import "../../styles/pasien.css";

import { Plus, Search, Pencil, Trash2 } from "lucide-react";

import { formatDateTime } from "../../utils/formatDate";
import { useUser } from "../../hooks/useUser";
import ModalUser from "../../components/user/ModalUser";
import ModalKonfirmasi from "../../components/common/ModalKonfirmasi";

import { getPaginationItems } from "../../utils/pagination";
import Pagination from "../../components/common/Pagination";
import { usePeran } from "../../hooks/usePeran";
import { usePasienDropdown } from "../../hooks/usePasienDropdown";
import useGateway from "../../hooks/useGateway";

export default function UserPage() {
  const {
    users,
    search,
    setSearch,

    openModal,
    setOpenModal,

    newUser,
    setNewUser,
    konfirmasipassword,
    setKonfirmasiPassword,

    errors,
    setErrors,
    modalMode,

    openDeleteModal,
    setOpenDeleteModal,

    selectedDeleteUser,

    currentPage,
    setCurrentPage,
    totalPage,

    handleOpenTambah,
    handleOpenEdit,
    handleOpenDelete,
    handleConfirmDelete,
    handleSaveUser,
  } = useUser();

  const { peran, ambilPeran } = usePeran();

  const { gateway, ambilGateway } = useGateway();

  const page = getPaginationItems(currentPage, totalPage);

  return (
    <div className="setup-container">
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manajamen User</h1>

          <p className="page-subtitle">Kelola akun pengguna sistem</p>
        </div>
      </div>

      {/* ====================================================== */}
      {/* SEARCH */}
      {/* ====================================================== */}
      <div className="card-custom">
        <div className="card-header-flex">
          <label className="label-header">Cari User</label>

          <button
            className="btn-primary"
            onClick={() => {
              ambilPeran();
              handleOpenTambah();
            }}
          >
            <Plus size={18} />
            Tambah User
          </button>
        </div>

        <div className="search-wrapper-modern">
          <Search size={18} className="search-icon" />

          <input
            type="text"
            placeholder="Cari username atau role..."
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
                <th>Username</th>
                <th className="th-center">Role</th>
                <th>Dibuat Pada</th>
                <th className="th-center">Status</th>
                <th className="th-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((item, index) => (
                <tr key={item.id_user} className="modern-row">
                  <td>{index + 1}</td>

                  <td>
                    <div className="patient-name-text">{item.username}</div>
                  </td>

                  <td className="td-center">
                    <span
                      className={`
                      badge
                      ${
                        item.nama_role === "admin"
                          ? "admin"
                          : item.nama_role === "dokter"
                            ? "dokter"
                            : item.nama_role === "super admin"
                              ? "super-admin"
                              : item.nama_role === "perawat"
                                ? "perawat"
                                : "pasien"
                      }
                    `}
                    >
                      {item.nama_role}
                    </span>
                  </td>

                  <td>{formatDateTime(item.diperbarui_pada)}</td>
                  <td className="td-center">
                    <span
                      className={`
                        badge
                        ${item.status_aktif === 0 ? "active" : "inactive"}
                      `}
                    >
                      {item.status_aktif === 0 ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="td-center">
                    <div className="action-wrapper">
                      <button
                        className="icon-button edit"
                        onClick={() => handleOpenEdit(item)}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        className="icon-button delete"
                        onClick={() => handleOpenDelete(item)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-table">
                    Data user tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
            pages={page}
            totalPages={totalPage}
          />
        </div>
      </div>

      <ModalUser
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSaveUser}
        form={newUser}
        setForm={setNewUser}
        errors={errors}
        setErrors={setErrors}
        mode={modalMode}
        peranList={peran}
        konfirmasipassword={konfirmasipassword}
        setKonfirmasiPassword={setKonfirmasiPassword}
      />

      <ModalKonfirmasi
        open={openDeleteModal}
        title="Hapus User"
        message={`Apakah anda yakin ingin menghapus user ${selectedDeleteUser?.username}?`}
        confirmText="Hapus"
        cancelText="Batal"
        type="warning"
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenDeleteModal(false)}
      />
    </div>
  );
}
