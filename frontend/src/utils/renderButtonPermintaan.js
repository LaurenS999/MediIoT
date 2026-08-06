import React from "react";

export default function renderActionButton(
  item,
  navigate,
  onAction,
  isPerawat,
  isPasien,
) {
  const hariIni = new Date().toISOString().split("T")[0];
  const tanggalPemeriksaan = item.tanggal_pemeriksaan?.toString().split("T")[0];
  const isHariIni = item.tanggal_pemeriksaan === hariIni;

  switch (item.status) {
    case "menunggu pemeriksaan":
      return (
        <div className="action-button-group">
          {isPerawat && isHariIni && (
            <button
              className="btn-success"
              onClick={() =>
                navigate("/setup-kunjungan", {
                  state: {
                    id_pasien: item.id_pasien,
                  },
                })
              }
            >
              Pemeriksaan
            </button>
          )}

          {(isPerawat || isPasien) && (
            <button
              className="btn-batal"
              onClick={() => onAction("batal", item)}
            >
              Batal
            </button>
          )}
        </div>
      );

    case "observasi":
      return isPerawat ? (
        <div className="action-button-group">
          <button
            className="btn-selesai"
            onClick={() => onAction("selesai", item)}
          >
            Selesai
          </button>
        </div>
      ) : (
        "-"
      );

    default:
      return "";
  }
}
