import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../../styles/Navbar/Navbar.css";

import LogoutButton from "../LogoutButton";
import { useAuth } from "../../context/AuthContext";

import { Settings, Bell, User } from "lucide-react";

import ModalKonfirmasi from "./ModalKonfirmasi";
import { deleteStatusDevice } from "../../services/deviceService";

import useNotifikasiDokter from "../../hooks/useNotifikasiDokter";
import useNotifikasiPerawat from "../../hooks/useNotifikasiPerawat";

import NotifikasiDropdown from "../notifikasi/NotifikasiDropdown";

import { notifikasiConfig } from "../../config/notifikasiConfig";
import { getPageTitle } from "../../config/pageConfig";

export default function Header() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [showDropdown, setShowDropdown] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const dropdownRef = useRef(null);

  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const [showExitModal, setShowExitModal] = useState(false);

  const [openNotification, setOpenNotification] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);
  const [loadingExit, setLoadingExit] = useState(false);

  const dokterNotif = useNotifikasiDokter();
  const perawatNotif = useNotifikasiPerawat();

  const config = notifikasiConfig[user?.role];

  // const notificationData = dokterNotif;
  const notificationData = user?.role === "dokter" ? dokterNotif : perawatNotif;

  const { notifikasi, count, loading } = notificationData;

  const handleCancelExit = () => {
    setShowExitModal(false);
    setPendingPath(null);
  };

  const handleConfirmExit = async () => {
    try {
      setLoadingExit(true);

      const devices = JSON.parse(
        sessionStorage.getItem("activeDevices") || "[]",
      );

      await Promise.all(
        devices.map((device) => deleteStatusDevice(device.mac_address)),
      );

      sessionStorage.removeItem("activeDevices");

      setShowExitModal(false);

      navigate(pendingPath);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingExit(false);
    }
  };
  const handleSetting = () => {
    navigate("/setting");
  };

  // =====================================================
  // CLOSE DROPDOWN
  // =====================================================
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}
      {token && (
        <header className={`top-header ${collapsed ? "collapsed" : ""}`}>
          <div className="header-page-title">
            <h2>{pageTitle}</h2>
          </div>

          <div className="header-right">
            {/* NOTIFICATION */}
            {["dokter", "perawat", "super admin"].includes(user?.role) && (
              <div className="notification-wrapper">
                <button
                  className="notification-button"
                  onClick={() => {
                    setOpenNotification((prev) => !prev);
                  }}
                >
                  <Bell size={20} />

                  {count > 0 && (
                    <span className="notification-badge">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </button>

                {openNotification && (
                  <NotifikasiDropdown
                    title={config.title}
                    ItemComponent={config.ItemComponent}
                    notifications={notifikasi}
                    loading={loading}
                    onItemClick={(item) => {
                      config.onItemClick(navigate, item);
                      setOpenNotification(false);
                    }}
                    onSeeAll={() => {
                      config.onSeeAll(navigate);
                      setOpenNotification(false);
                    }}
                  />
                )}
              </div>
            )}

            {/* USER PROFILE */}
            <div className="nav-user-container" ref={dropdownRef}>
              <div
                className={`user-profile-trigger ${
                  showDropdown ? "active" : ""
                }`}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="user-avatar">
                  {user?.username?.substring(0, 2).toUpperCase()}
                </div>

                {!collapsed && (
                  <>
                    <span className="user-name">{user?.username}</span>

                    <span
                      className={`arrow-icon ${showDropdown ? "rotate" : ""}`}
                    >
                      ▾
                    </span>
                  </>
                )}
              </div>

              {/* DROPDOWN */}
              {showDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <strong>{user?.username}</strong>
                    <span>{user?.role}</span>
                  </div>

                  <hr />

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/profile");
                    }}
                  >
                    <User size={18} />
                    Profile
                  </button>

                  {user.role == "admin" ||
                    (user.role == "super admin" && (
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setShowDropdown(false);
                          navigate("/Access-Code");
                        }}
                      >
                        <Settings size={18} />
                        MedLink Access Code
                      </button>
                    ))}

                  <div className="dropdown-item logout-wrapper">
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      )}
    </>
  );
}
