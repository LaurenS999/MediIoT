import React, { useState } from "react";
import "../../styles/setting.css";

import {
  updateProfilePassword,
  updateProfileUser,
} from "../../services/profileServices";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Eye, EyeClosed } from "lucide-react";

export default function ProfilePage() {
  const { user, token, login } = useAuth();
  const [errors, setErrors] = useState({});

  const [showPasswordLama, setShowPasswordLama] = useState(false);
  const [showPasswordBaru, setShowPasswordBaru] = useState(false);
  const [showkonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);

  // ==============================
  // PROFILE STATE
  // ==============================
  const [profile, setProfile] = useState({
    username: user?.username || "",
    role: user?.role || "",
  });

  // ==============================
  // PASSWORD STATE
  // ==============================
  const [password, setPassword] = useState({
    password_lama: "",
    password_baru: "",
    konfirmasi_password: "",
  });

  // ==============================
  // HANDLE PROFILE CHANGE
  // ==============================
  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  // ==============================
  // HANDLE PASSWORD CHANGE
  // ==============================
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPassword((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  // ==============================
  // SAVE PROFILE
  // ==============================
  const handleSaveProfile = async () => {
    try {
      const userStorage = JSON.parse(localStorage.getItem("user"));

      const payload = {
        username: profile.username,
      };

      const response = await updateProfileUser(payload);

      const updatedUser = {
        ...userStorage,
        username: profile.username,
      };

      login(token, updatedUser);

      toast.success(response?.data?.message);
    } catch (error) {
      console.error("ERROR UPDATE PROFILE :", error);

      if (error.response?.status === 401) {
        toast.warning(error.response?.data?.message);
      } else {
        toast.error(error.response?.data?.message);
      }
    }
  };

  // ==============================
  // SAVE PASSWORD
  // ==============================
  const handleSavePassword = async () => {
    const newErrors = {};

    if (!password.password_lama) {
      newErrors.password_lama = "Password Lama wajib diisi";
    }

    if (!password.password_baru) {
      newErrors.password_baru = "Passwrd Baru wajib diisi";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.warning("Data tidak boleh kosong");
      return;
    }

    if (password.password_baru !== password.konfirmasi_password) {
      toast.warning("Konfirmasi password dan password baru tidak sesuai");
      newErrors.konfirmasi_password = "Konfirmasi password tidak sesuai";
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        password_lama: password.password_lama,
        password_baru: password.password_baru,
      };

      const response = await updateProfilePassword(payload);

      toast.success(response?.data?.message);

      setPassword({
        password_lama: "",
        password_baru: "",
        konfirmasi_password: "",
      });
    } catch (error) {
      console.error("ERROR UPDATE PASSWORD :", error);

      if (error.response?.status === 401) {
        toast.warning(error.response?.data?.message);
      } else {
        toast.error(error.response?.data?.message);
      }
    }
  };

  return (
    <div className="setting-page">
      {/* HEADER */}
      <div className="setting-header">
        {/* <h1>Profile</h1>
        <p>Kelola akun dan password</p> */}
      </div>

      {/* PROFILE CARD */}
      <div className="setting-card">
        <h2>Profile User</h2>

        <div className="form-group">
          <label>Username</label>

          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleProfileChange}
          />
        </div>

        <div className="form-group">
          <label>Role</label>

          <input type="text" value={profile.role} disabled />
        </div>

        <button className="save-button" onClick={handleSaveProfile}>
          Simpan Profile
        </button>
      </div>

      {/* PASSWORD CARD */}
      <div className="setting-card">
        <h2>Security</h2>

        <div className="form-group">
          <label>Password Lama</label>

          <div className="password-input">
            <input
              name="password_lama"
              className={errors.password_lama ? "input-error" : ""}
              type={showPasswordLama ? "text" : "password"}
              value={password.password_lama}
              onChange={handlePasswordChange}
              placeholder="Masukkan password lama"
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPasswordLama((prev) => !prev)}
            >
              {showPasswordLama ? <Eye></Eye> : <EyeClosed></EyeClosed>}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Password Baru</label>

          <div className="password-input">
            <input
              name="password_baru"
              className={errors.password_baru ? "input-error" : ""}
              type={showPasswordBaru ? "text" : "password"}
              value={password.password_baru}
              onChange={handlePasswordChange}
              placeholder="Masukkan password lama"
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPasswordBaru((prev) => !prev)}
            >
              {showPasswordBaru ? <Eye></Eye> : <EyeClosed></EyeClosed>}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Konfirmasi Password Baru</label>

          <div className="password-input">
            <input
              name="konfirmasi_password"
              className={errors.konfirmasi_password ? "input-error" : ""}
              type={showkonfirmasiPassword ? "text" : "password"}
              value={password.konfirmasi_password}
              onChange={handlePasswordChange}
              placeholder="Masukkan password lama"
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowKonfirmasiPassword((prev) => !prev)}
            >
              {showkonfirmasiPassword ? <Eye></Eye> : <EyeClosed></EyeClosed>}
            </button>
          </div>
        </div>

        <button className="save-button" onClick={handleSavePassword}>
          Ubah Password
        </button>
      </div>
    </div>
  );
}
