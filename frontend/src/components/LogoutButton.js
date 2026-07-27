import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logOutUser } from "../services/adminPanelServices";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // HAPUS SESSION LOCAL
      logout();

      // REDIRECT LOGIN
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
}
