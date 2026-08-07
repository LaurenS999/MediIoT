import "../../styles/tidakDitemukan.css";

import { TriangleAlert } from "lucide-react";

import { useNavigate } from "react-router-dom";

const TidakDitemukan = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="notfound-card">
        <div className="notfound-icon">
          <TriangleAlert size={52} />
        </div>

        <h1>404</h1>

        <h2>Halaman Tidak Ditemukan</h2>

        <p>Halaman yang anda cari tidak tersedia atau sudah dipindahkan.</p>

        <button className="notfound-btn" onClick={() => navigate("/")}>
          Kembali ke Halaman Utama
        </button>
      </div>
    </div>
  );
};

export default TidakDitemukan;
