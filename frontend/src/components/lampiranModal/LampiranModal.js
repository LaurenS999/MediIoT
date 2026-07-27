import { X, Plus, Trash2 } from "lucide-react";

import "./LampiranModal.css";
import ModalKonfirmasi from "../common/ModalKonfirmasi";
import UploadLampiranModal from "./UploadLampiranModal";

import useLampiran from "../../hooks/useLampiran";

const LampiranModal = ({ show, onClose, idKunjungan }) => {
  const {
    lampiran,
    setLampiran,
    loading,
    showDeleteModal,
    setShowDeleteModal,
    selectedLampiran,
    setSelectedLampiran,
    deleteLoading,
    showUploadModal,
    setShowUploadModal,
    previewImage,
    setPreviewImage,

    handleUploadLampiran,
    handleDelete,
  } = useLampiran(idKunjungan);

  const renderPreview = (item) => {
    const ext = item.nama_file.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "webp"].includes(ext)) {
      return (
        <img
          src={item.url}
          alt={item.nama_file}
          className="lampiran-thumbnail"
          onClick={() => setPreviewImage(item)}
        />
      );
    }

    return <div className="lampiran-file-icon">File</div>;
  };

  if (!show) return null;

  if (showUploadModal) {
    return (
      <UploadLampiranModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSave={handleUploadLampiran}
      />
    );
  }
  return (
    <div className="lampiran-overlay">
      <div className="lampiran-modal">
        <div className="lampiran-header">
          <h3>Lampiran Kunjungan</h3>

          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="lampiran-body">
          <div className="lampiran-toolbar">
            <button
              className="btn-primary"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={18} />

              <span>Tambah Lampiran</span>
            </button>
          </div>

          <div className="lampiran-content">
            {loading ? (
              <div className="lampiran-loading">Memuat data...</div>
            ) : (
              <div className="table-responsive">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Preview</th>

                      <th>Nama File</th>

                      <th>Kategori</th>

                      <th>Tanggal</th>

                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lampiran.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="lampiran-empty">
                          Belum ada lampiran
                        </td>
                      </tr>
                    ) : (
                      lampiran.map((item) => (
                        <tr key={item.id} className="modern-row">
                          <td>{renderPreview(item)}</td>

                          <td>{item.nama_file}</td>

                          <td>{item.kategori}</td>

                          <td>
                            {new Date(item.dibuat_pada).toLocaleDateString(
                              "id-ID",
                            )}
                          </td>

                          <td>
                            <button
                              className="btn-delete"
                              onClick={() => {
                                setSelectedLampiran(item);
                                setShowDeleteModal(true);
                              }}
                              disabled={deleteLoading === item.id}
                            >
                              {deleteLoading === item.id ? (
                                "..."
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="lampiran-footer">
          <button className="btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
      <ModalKonfirmasi
        open={showDeleteModal}
        type="warning"
        title="Hapus Lampiran"
        message={
          selectedLampiran
            ? `Apakah Anda yakin ingin menghapus lampiran "${selectedLampiran.nama_file}"?`
            : ""
        }
        confirmText="Hapus"
        cancelText="Batal"
        loading={deleteLoading}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedLampiran(null);
        }}
        onConfirm={handleDelete}
      />
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
      ;
    </div>
  );
};

export default LampiranModal;
