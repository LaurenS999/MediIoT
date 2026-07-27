import { use, useState } from "react";
import {
  getCurrentUser,
  loginSandbox,
  loginUser,
} from "../services/adminPanelServices";
import { useNavigate } from "react-router-dom";
import { postLogin } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { useModalInfo } from "../context/ModalInfoProvider.js";

import { toast } from "react-toastify";

export default function useLogin() {
  const { login } = useAuth();
  const { showModal } = useModalInfo();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [user, setUser] = useState([]);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    const result = await handleSubmit(e);

    if (result?.success) {
      if (result.res.data?.data?.user.role == "dokter") {
        navigate("/pemeriksaan-dokter");
      } else if (result.res.data?.data?.user.role == "pasien") {
        navigate(`/rekam-medis-saya`);
      } else {
        navigate("/setup-kunjungan");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newErrors = {};

      if (!form.username) {
        newErrors.username = "Username wajib diisi";
      }

      if (!form.password) {
        newErrors.password = "Password wajib diisi";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.warning("Data tidak boleh kosong");
        return;
      }

      const res = await postLogin(form);
      login(res.data.data.token, res.data.data.user);

      // currentUser();
      setUser(res.data.data);

      return { success: true, res };
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Server Tidak Terjangkau");
      }

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    form,
    setForm,
    errors,
    setErrors,
    loading,
    handleSubmit,
    onSubmit,
  };
}
