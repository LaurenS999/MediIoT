import React, { useState } from "react";
import "../../styles/Login.css";
import useLogin from "../../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import ModalInfo from "../../components/common/ModalInfo";
import { Eye, EyeClosed, SquarePlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import BackgroundLogin from "../../assets/images/BackgroundLogin.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { form, setForm, errors, setErrors, loading, onSubmit } = useLogin();

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${BackgroundLogin})`,
      }}
    >
      <div className="login-card">
        {/* BRANDING */}
        <div className="login-brand">
          <SquarePlus size={42} strokeWidth={2.2} />

          <div className="logo-text-wrapper">
            <span className="logo-text">
              Medi<span className="logo-bold">IoT</span>
            </span>

            <small className="logo-subtitle">Smart Hospital System</small>
          </div>
        </div>

        {/* JUDUL */}
        <div className="login-header">
          <h2>Selamat Datang</h2>
          <p>Silakan masuk untuk melanjutkan</p>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>

            <input
              className={errors.username ? "input-error" : ""}
              type="text"
              name="username"
              value={form.username}
              onChange={(e) => {
                setForm({
                  ...form,
                  username: e.target.value.replace(/\s/g, ""),
                });

                setErrors((prev) => ({
                  ...prev,
                  username: false,
                }));
              }}
              placeholder="Masukkan username"
            />

            {errors.username && (
              <span className="error-text">Username wajib diisi</span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="password-input">
              <input
                className={errors.password ? "input-error" : ""}
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => {
                  setForm({
                    ...form,
                    password: e.target.value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    password: false,
                  }));
                }}
                placeholder="Masukkan password"
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
              </button>
            </div>

            {errors.password && (
              <span className="error-text">Password wajib diisi</span>
            )}
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            Masuk
          </button>
        </form>

        <div className="login-footer">
          <p>Electronic Medical Record System</p>
        </div>
      </div>
    </div>
  );
}
