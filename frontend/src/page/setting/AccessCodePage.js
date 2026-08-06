import React, { useState } from "react";
import "../../styles/setting.css";

import { createAccessToken } from "../../services/accessTokenService";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/showToast";

export default function AccessCodePage() {
  const { user } = useAuth();
  const [errors, setErrors] = useState({});

  // ==============================
  // API CONFIG STATE
  // ==============================
  const [apiConfig, setApiConfig] = useState({
    client_id: "",
    client_key: "",
    server_key: "",
  });

  const [showServerKey, setShowServerKey] = useState(false);
  const [showClientKey, setShowClientKey] = useState(false);

  const validasi = () => {
    const newErrors = {};

    if (!apiConfig.client_id.trim()) {
      newErrors.client_id = true;
    }

    if (!apiConfig.client_key.trim()) {
      newErrors.client_key = true;
    }

    if (!apiConfig.server_key.trim()) {
      newErrors.server_key = true;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast("Data tidak boleh kosong", "access-code", "warning");
      return false;
    }

    return true;
  };

  // ==============================
  // HANDLE API CONFIG CHANGE
  // ==============================
  const handleApiChange = (e) => {
    const { name, value } = e.target;

    setApiConfig((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  // ==============================
  // SAVE API CONFIG
  // ==============================
  const handleSaveApi = async () => {
    if (!validasi()) return;

    try {
      const payload = {
        client_id: apiConfig.client_id.trim(),
        client_key: apiConfig.client_key.trim(),
        server_key: apiConfig.server_key.trim(),
        id_user: user.id_user,
      };

      const response = await createAccessToken(payload);
      showToast(response?.data?.message, "access-code", "success");
    } catch (error) {
      console.error("ERROR UPDATE API KEY :", error.response?.data?.message);
      showToast(error.response?.data?.message, "access-code", "error");
    }
  };

  return (
    <div className="setting-page">
      {/* API CARD */}

      <div className="setting-card">
        <h2>API Access Key</h2>

        <div className="form-group">
          <label>Client ID</label>

          <input
            type="text"
            name="client_id"
            value={apiConfig.client_id}
            className={errors.client_id ? "input-error" : ""}
            onChange={handleApiChange}
          />
        </div>

        <div className="form-group">
          <label>Client Key</label>

          <div className="server-key-wrapper">
            <input
              type={showClientKey ? "text" : "password"}
              className={errors.client_key ? "input-error" : ""}
              name="client_key"
              value={apiConfig.client_key}
              onChange={handleApiChange}
            />

            <button
              className="show-button"
              onClick={() => setShowClientKey(!showClientKey)}
            >
              {showClientKey ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Server Key</label>

          <div className="server-key-wrapper">
            <input
              type={showServerKey ? "text" : "password"}
              className={errors.server_key ? "input-error" : ""}
              name="server_key"
              value={apiConfig.server_key}
              onChange={handleApiChange}
            />

            <button
              className="show-button"
              onClick={() => setShowServerKey(!showServerKey)}
            >
              {showServerKey ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button className="save-button" onClick={handleSaveApi}>
          Simpan Access Key
        </button>
      </div>
    </div>
  );
}
