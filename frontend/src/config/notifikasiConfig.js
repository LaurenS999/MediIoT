import NotifikasiItemDokter from "../components/notifikasi/NotifikasiItemDokter";
import NotifikasiItemPerawat from "../components/notifikasi/NotifikasiItemPerawat";

export const notifikasiConfig = {
  dokter: {
    title: "Menunggu Pemeriksaan Dokter",
    ItemComponent: NotifikasiItemDokter,

    onItemClick: (navigate, id) => {
      navigate(`/pemeriksaan-dokter/${id}`);
    },

    onSeeAll: (navigate) => {
      navigate("/pemeriksaan-dokter");
    },
  },

  perawat: {
    title: "Menunggu Permintaan Pemeriksaan",
    ItemComponent: NotifikasiItemPerawat,

    onItemClick: (navigate, item) => {
      if (item.status === "observasi") {
        navigate("/permintaan-pemeriksaan");
        return;
      }

      navigate("/setup-kunjungan", {
        state: {
          id_pasien: item.id_pasien,
        },
      });
    },

    onSeeAll: (navigate) => {
      navigate("/permintaan-pemeriksaan");
    },
  },

  "super admin": {
    title: "Menunggu Permintaan Pemeriksaan",
    ItemComponent: NotifikasiItemPerawat,

    onItemClick: (navigate, item) => {
      if (item.status === "observasi") {
        navigate("/permintaan-pemeriksaan");
        return;
      }

      navigate("/setup-kunjungan", {
        state: {
          id_pasien: item.id_pasien,
        },
      });
    },

    onSeeAll: (navigate) => {
      navigate("/permintaan-pemeriksaan");
    },
  },
};
