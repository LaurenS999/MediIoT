import { useRef, useState } from "react";
import { X, Upload, LoaderCircle } from "lucide-react";

import "./UploadLampiranModal.css";
import { showToast } from "../../utils/showToast";

const UploadLampiranModal = ({ open, onClose, onSave }) => {
  const fileInputRef = useRef(null);

  const [kategori, setKategori] = useState("photo");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // =====================================================
  // PILIH FILE
  // =====================================================
  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  // =====================================================
  // FILE BERUBAH
  // =====================================================
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);
  };

  // =====================================================
  // RESET FORM
  // =====================================================
  const resetForm = () => {
    setKategori("photo");
    setFiles([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // TUTUP MODAL
  // =====================================================
  const handleClose = () => {
    if (loading) return;

    resetForm();
    onClose();
  };

  // =====================================================
  // SIMPAN
  // =====================================================
  const handleSubmit = async () => {
    if (files.length === 0) {
      showToast("Lampiran Kosong", "Lampiran-upload", "warning");
      return;
    }

    try {
      setLoading(true);

      const lampiran = files.map((file) => ({
        kategori,
        file,
      }));

      if (onSave) {
        await onSave(lampiran);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error(error);

      alert("Gagal memproses lampiran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lampiran-upload-overlay">
      <div className="lampiran-upload-modal">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="lampiran-upload-header">
          <h3>Tambah Lampiran</h3>

          <button
            className="lampiran-upload-close-btn"
            onClick={handleClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <div className="lampiran-upload-body">
          {/* ================================================ */}
          {/* KATEGORI */}
          {/* ================================================ */}

          <div className="lampiran-upload-group">
            <label>Kategori</label>

            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              disabled={loading}
              className="lampiran-upload-select"
            >
              <option value="photo">Photo</option>
              <option value="laboratory">Laboratory</option>
              <option value="radiology">Radiology</option>
              <option value="ecg">ECG</option>
            </select>
          </div>

          {/* ================================================ */}
          {/* FILE INPUT */}
          {/* ================================================ */}

          <div className="lampiran-upload-group">
            <label>Lampiran</label>

            <p className="lampiran-upload-info">
              Format yang didukung: JPG, PNG, WEBP, dan PDF
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleFileChange}
            />

            <div
              className="lampiran-upload-dropzone"
              onClick={handleChooseFile}
            >
              <Upload size={42} />

              <h4>Klik untuk memilih file</h4>

              <p>Mendukung upload lebih dari satu file</p>
            </div>
          </div>

          {/* ================================================ */}
          {/* LIST FILE */}
          {/* ================================================ */}

          <div className="lampiran-upload-file-list">
            {files.length === 0 ? (
              <div className="lampiran-upload-empty">
                Belum ada file dipilih
              </div>
            ) : (
              files.map((file, index) => (
                <div className="lampiran-upload-file-item" key={index}>
                  <span>
                    {index + 1}. {file.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================================================ */}
        {/* FOOTER */}
        {/* ================================================ */}

        <div className="lampiran-upload-footer">
          <button
            className="btn-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Batal
          </button>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle size={18} className="spin" />

                <span>Menyimpan...</span>
              </>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadLampiranModal;
