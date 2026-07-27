import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ModalInfo from "./common/ModalInfo";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { token, user } = useAuth();
  // =========================================
  // GET TOKEN & USER
  // =========================================
  // const token = localStorage.getItem("token");

  // const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role;

  // =========================================
  // NAVIGATION
  // =========================================
  const navigate = useNavigate();

  const hasAlerted = useRef(false);

  // =========================================
  // MODAL
  // =========================================
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    // =========================================
    // BELUM LOGIN
    // =========================================
    if ((!token || !user) && !hasAlerted.current) {
      setMessage("Kamu belum login");
      setShowModal(true);

      hasAlerted.current = true;
      return;
    }

    // =========================================
    // ROLE TIDAK SESUAI
    // =========================================
    if (token && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      setMessage("Kamu tidak memiliki akses");
      setShowModal(true);

      hasAlerted.current = true;
    }
  }, [token, role, allowedRoles]);

  // =========================================
  // BELUM LOGIN
  // =========================================
  if (!token) {
    return (
      <ModalInfo
        isOpen={showModal}
        message={message}
        onClose={() => {
          setShowModal(false);
          navigate("/login");
        }}
      />
    );
  }

  // =========================================
  // ROLE TIDAK SESUAI
  // =========================================
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <ModalInfo
        isOpen={showModal}
        message={message}
        onClose={() => {
          setShowModal(false);

          navigate("/");
        }}
      />
    );
  }

  return children;
}
