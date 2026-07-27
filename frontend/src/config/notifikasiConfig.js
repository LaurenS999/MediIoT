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

  // perawat: {
  //   title: "Menunggu Pengukuran",
  //   ItemComponent: NotifikasiItemPerawat,

  //   onItemClick: (navigate, id) => {
  //     navigate(`/pendaftaran`);
  //   },

  //   onSeeAll: (navigate) => {
  //     navigate("/pendaftaran");
  //   },
  // },
};
