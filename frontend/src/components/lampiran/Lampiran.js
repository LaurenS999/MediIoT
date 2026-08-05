import React from "react";
import { Plus, FileText, Image, Trash2, Upload } from "lucide-react";

import "../../styles/common/lampiran.css";

const kategoriLabel = {
  photo: "Photo",
  laboratory: "Laboratory",
  radiology: "Radiology",
  ecg: "ECG",
  other: "Other",
};

const Lampiran = ({
  files = [],
  onAdd,
  onDelete,
  canAdd = true,
  canDelete = true,
}) => {
  // =====================================================
  // NORMALISASI DATA
  // =====================================================

  const getFileData = (item) => {
    // Data dari UploadLampiranModal
    if (item.file instanceof File) {
      return {
        file: item.file,
        name: item.file.name,
        type: item.file.type,
        size: item.file.size,
        url: null,
      };
    }

    // Data dari backend
    return {
      file: null,
      name: item.nama_file || item.name || "-",
      type: item.mime_type || item.type || "",
      size: item.ukuran || item.size || 0,
      url: item.url || item.file_url || item.path_file || null,
    };
  };

  // =====================================================
  // PREVIEW GAMBAR
  // =====================================================

  const handlePreview = (item) => {
    const data = getFileData(item);

    // File baru dari browser
    if (data.file) {
      const url = URL.createObjectURL(data.file);

      window.open(url, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      return;
    }

    // File dari backend
    if (data.url) {
      window.open(data.url, "_blank");
    }
  };

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const handleDownload = (item) => {
    const data = getFileData(item);

    // File baru dari browser
    if (data.file) {
      const url = URL.createObjectURL(data.file);

      const link = document.createElement("a");

      link.href = url;
      link.download = data.name;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

      return;
    }

    // File dari backend
    if (data.url) {
      const link = document.createElement("a");

      link.href = data.url;
      link.download = data.name;
      link.target = "_blank";

      document.body.appendChild(link);

      link.click();

      link.remove();
    }
  };

  // =====================================================
  // FORMAT SIZE
  // =====================================================

  const formatFileSize = (size) => {
    if (!size) return "-";

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    }

    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="lampiran-header">
        <div className="lampiran-title">
          <h3>Lampiran</h3>
        </div>

        {canAdd && (
          <button type="button" className="btn-tambah-lampiran" onClick={onAdd}>
            <Plus size={17} />
            Tambah Lampiran
          </button>
        )}
      </div>

      {/* ================================================= */}
      {/* EMPTY */}
      {/* ================================================= */}

      {files.length === 0 ? (
        <div className="lampiran-empty">
          <div className="lampiran-empty-icon">
            <Upload size={36} />
          </div>

          <h4>Belum ada lampiran</h4>

          <p>
            Tambahkan hasil laboratorium, foto klinis,
            <br />
            radiologi, ECG, atau dokumen pendukung.
          </p>

          {canAdd && (
            <span>Format: JPG, PNG, WEBP, PDF • Maks. 10 MB per file</span>
          )}
        </div>
      ) : (
        /* ================================================= */
        /* LIST */
        /* ================================================= */

        <div className="lampiran-list">
          {files.map((item, index) => {
            const data = getFileData(item);

            console.log("DATA LAMPIRAN : ", data);

            const isImage = data.type.startsWith("image/");
            const isPdf = data.type === "application/pdf";

            return (
              <div className="lampiran-item" key={item.id_lampiran || index}>
                {/* FILE ICON */}

                <div className="lampiran-file-icon">
                  {isImage ? <Image size={22} /> : <FileText size={22} />}
                </div>

                {/* FILE INFO */}

                <div className="lampiran-info">
                  <strong title={data.name}>{data.name}</strong>

                  <div className="lampiran-meta">
                    <span>
                      {kategoriLabel[item.kategori] || item.kategori || "-"}
                    </span>

                    <span>•</span>

                    <span>{formatFileSize(item.ukuran_file)}</span>
                  </div>
                </div>

                {/* ACTION */}

                <div className="lampiran-actions">
                  {/* PREVIEW IMAGE */}

                  {isImage && (
                    <button
                      type="button"
                      className="btn-lampiran-preview"
                      onClick={() => handlePreview(item)}
                    >
                      Preview
                    </button>
                  )}

                  {/* DOWNLOAD PDF */}

                  {isPdf && (
                    <button
                      type="button"
                      className="btn-lampiran-download"
                      onClick={() => handleDownload(item)}
                    >
                      Download
                    </button>
                  )}

                  {/* DELETE */}

                  {canDelete && (
                    <button
                      type="button"
                      className="btn-lampiran-delete"
                      onClick={() => onDelete(index)}
                      title="Hapus lampiran"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Lampiran;
