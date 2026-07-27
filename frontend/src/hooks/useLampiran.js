import { useEffect, useRef, useState } from "react";

import {
  getLampiran,
  uploadLampiran,
  deleteLampiran,
} from "../services/lampiranKunjunganService";

export default function useLampiran(id_kunjungan) {
  const [loading, setLoading] = useState(false);
  const [lampiran, setLampiran] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLampiran, setSelectedLampiran] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (id_kunjungan) {
      fetchLampiran();
    }
  }, [id_kunjungan]);

  const fetchLampiran = async () => {
    try {
      setLoading(true);

      const response = await getLampiran(id_kunjungan);

      setLampiran(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadLampiran = async (lampiran) => {
    try {
      const formData = new FormData();

      formData.append("id_kunjungan", id_kunjungan);

      lampiran.forEach((item) => {
        formData.append("files", item.file);
        formData.append("kategori[]", item.kategori);
      });

      await uploadLampiran(formData);

      fetchLampiran();
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Gagal mengunggah lampiran.");
    }
  };

  const handleDelete = async () => {
    if (!selectedLampiran) return;

    try {
      setDeleteLoading(true);

      await deleteLampiran(selectedLampiran.id);

      fetchLampiran();

      setShowDeleteModal(false);

      setSelectedLampiran(null);
    } catch (error) {
      console.error(error);

      alert("Gagal menghapus lampiran.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    lampiran,
    setLampiran,
    loading,
    setLoading,
    showDeleteModal,
    setShowDeleteModal,
    selectedLampiran,
    setSelectedLampiran,
    deleteLoading,
    setDeleteLoading,
    showUploadModal,
    setShowUploadModal,
    previewImage,
    setPreviewImage,

    handleUploadLampiran,
    handleDelete,
  };
}
