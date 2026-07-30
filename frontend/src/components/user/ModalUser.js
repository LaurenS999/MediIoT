import "../../styles/dropDown.css";
import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { usePasienDropdown } from "../../hooks/usePasienDropdown";
import useGateway from "../../hooks/useGateway";

export default function ModalUser({
  isOpen,
  onClose,
  onSave,
  form,
  setForm,
  errors,
  setErrors,
  peranList,

  konfirmasipassword,
  setKonfirmasiPassword,
  mode = "create",
}) {
  const conditionalRef = useRef(null);

  const { pasien, ambilPasienDropdown } = usePasienDropdown();
  const { gateway, ambilGateway } = useGateway();

  const [showPassword, setShowPassword] = useState(false);

  const pasienOptions = pasien?.map((item) => ({
    value: item.id_pasien,
    label: `${item.id_pasien} - ${item.nama}`,
  }));
  const PeranOptions = peranList.map((item) => ({
    value: item.id_peran,
    label: `${item.nama}`,
  }));
  const gatewayOptions = gateway?.map((item) => ({
    value: item.id,
    label: `${item.id} - ${item.name}`,
  }));

  const isRolePasien = Number(form.role) === 5;
  const isRolePerawat = Number(form.role) === 1;
  const isConditionalOpen = isRolePasien || isRolePerawat;
  const [conditionalHeight, setConditionalHeight] = useState(0);

  useEffect(() => {
    if (isOpen && isRolePasien) {
      ambilPasienDropdown(form.id_relasi);
    }
    if (isOpen && isRolePerawat) {
      ambilGateway();
    }
  }, [isOpen, isRolePasien, isRolePerawat]);

  useEffect(() => {
    if (conditionalRef.current) {
      setConditionalHeight(
        isConditionalOpen ? conditionalRef.current.scrollHeight : 0,
      );
    }
  }, [isConditionalOpen]);

  const isEdit = mode === "edit";
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* HEADER */}
        <div className="modal-header">
          <h2>{isEdit ? "Edit User" : "Tambah User"}</h2>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="modal-form">
          {/* USERNAME */}
          <div className="form-group full-width">
            <label>Username</label>

            <input
              type="text"
              placeholder="Masukkan username"
              className={errors.username ? "input-error" : ""}
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
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>

            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={
                  isEdit ? "Kosongkan jika tidak diubah" : "Masukkan password"
                }
                className={
                  errors.password || errors.password_kosong ? "input-error" : ""
                }
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
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye></Eye> : <EyeClosed></EyeClosed>}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Konfirmasi Password</label>

            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={
                  isEdit ? "Kosongkan jika tidak diubah" : "Masukkan password"
                }
                className={errors.password ? "input-error" : ""}
                value={konfirmasipassword}
                onChange={(e) => {
                  setKonfirmasiPassword(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    password: false,
                  }));
                }}
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye></Eye> : <EyeClosed></EyeClosed>}
              </button>
            </div>
          </div>

          {/* ROLE */}
          <div className="form-group ">
            <label>Role</label>

            <Select
              classNamePrefix="dropdown"
              className={errors.role ? "input-error" : ""}
              maxMenuHeight={240}
              options={PeranOptions}
              placeholder="Pilih Role user"
              value={
                PeranOptions.find((option) => option.value === form.role) ||
                null
              }
              onChange={(e) => {
                setForm({
                  ...form,
                  role: e?.value,
                });

                setErrors((prev) => ({
                  ...prev,
                  role: false,
                }));
              }}
              maxMenuHeight={240}
              isClearable
            />
          </div>

          {mode === "edit" && (
            <div className="form-group">
              <label>Status Aktif</label>

              <select
                value={form.status_aktif}
                onChange={(e) => {
                  setForm({
                    ...form,
                    status_aktif: Number(e.target.value),
                  });

                  setErrors((prev) => ({
                    ...prev,
                    status_aktif: false,
                  }));
                }}
              >
                <option value={0}>Aktif</option>
                <option value={1}>Tidak Aktif</option>
              </select>
            </div>
          )}

          <div
            className="full-width conditional-wrapper"
            style={{
              height: `${conditionalHeight}px`,
              opacity: isConditionalOpen ? 1 : 0,
            }}
          >
            <div ref={conditionalRef} className="conditional-content">
              {isRolePasien && (
                <div className="form-group">
                  <label>ID Pasien User</label>

                  <Select
                    className={
                      errors.id_relasi ? "dropdown input-error" : "dropdown"
                    }
                    options={pasienOptions}
                    placeholder="Pilih ID Pasien milik User"
                    value={
                      pasienOptions.find(
                        (option) => option.value === form.id_relasi,
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      setForm({
                        ...form,
                        id_relasi: selectedOption?.value || "",
                      })
                    }
                    isClearable
                  />
                </div>
              )}

              {isRolePerawat && (
                <div className="form-group">
                  <label>Tempat Bertugas</label>

                  <Select
                    className={
                      errors.bertugas_di ? "dropdown input-error" : "dropdown"
                    }
                    options={gatewayOptions}
                    placeholder="Pilih Gateway"
                    value={
                      gatewayOptions.find(
                        (option) => option.value === form.bertugas_di,
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      setForm({
                        ...form,
                        bertugas_di: selectedOption?.value || "",
                      })
                    }
                    isClearable
                  />
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Batal
            </button>

            <button type="button" className="btn-primary" onClick={onSave}>
              {isEdit ? "Update User" : "Simpan User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
