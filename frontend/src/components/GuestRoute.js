import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalInfo from "./common/ModalInfo";
import { useAuth } from "../context/AuthContext";

export default function GuestRoute({ children }) {
  const { token, user } = useAuth();

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  console.log("GUEST ROUTE : ", user);

  useEffect(() => {
    if (token) {
      setShowModal(true);
    }
  }, [token]);

  // jika sudah login tampilkan modal
  if (user) {
    return (
      <ModalInfo
        isOpen={showModal}
        message="Kamu sudah login"
        onClose={() => {
          setShowModal(false);
          navigate("/");
        }}
      />
    );
  }

  return children;
}
