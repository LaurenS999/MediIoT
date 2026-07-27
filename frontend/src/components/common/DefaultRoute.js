import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DefaultRoute() {
  const { user } = useAuth();

  switch (user?.role) {
    case "super admin":
    case "admin":
    case "perawat":
      return <Navigate to="/setup-kunjungan" replace />;

    case "dokter":
      return <Navigate to="/pemeriksaan-dokter" replace />;

    case "pasien":
      return <Navigate to="/rekam-medis-saya" replace />;

    default:
      return <Navigate to="/login" replace />;
  }
}
