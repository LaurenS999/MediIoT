import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/Navbar/Navbar.css";
import LogoutButton from "../LogoutButton";
import { useAuth } from "../../context/AuthContext";
import { sidebarMenu } from "../../config/sidebarMenu";

import { SquarePlus, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLocation } from "react-router-dom";
import ModalKonfirmasi from "./ModalKonfirmasi";
import { deleteStatusDevice } from "../../services/deviceService";

export default function Sidebar() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };
  const location = useLocation();

  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);
  const [loadingExit, setLoadingExit] = useState(false);

  const handleMenuClick = (e, label, path) => {
    if (location.pathname === "/pemeriksaan-awal") {
      e.preventDefault();

      setPendingPath(path);
      setShowExitModal(true);

      return;
    }
  };

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
  // RESPONSIVE SIDEBAR
  // =====================================================
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 1200);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {token && (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
          {/* LOGO */}
          <div className="sidebar-logo">
            <SquarePlus size={24} />

            {!collapsed && (
              <div className="logo-text-wrapper">
                <span className="logo-text">
                  Medi<span className="logo-bold">IoT</span>
                </span>

                <small className="logo-subtitle">Smart Hospital System</small>
              </div>
            )}
          </div>

          {/* TOGGLE SIDEBAR */}
          {/* <button
            className="sidebar-toggle-button"
            onClick={toggleSidebar}
            title={collapsed ? "Buka Sidebar" : "Tutup Sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button> */}

          {/* MENU */}
          <ul className="sidebar-menu">
            {sidebarMenu
              .filter((menu) => menu.roles.includes(user?.role))
              .map((menu) => {
                const Icon = menu.icon;

                return (
                  <li key={menu.path}>
                    <NavLink
                      to={menu.path}
                      title={menu.label}
                      onClick={(e) => handleMenuClick(e, menu.label, menu.path)}
                      className={({ isActive }) =>
                        isActive ? "sidebar-link active" : "sidebar-link"
                      }
                    >
                      <Icon size={20} />

                      {!collapsed && <span>{menu.label}</span>}
                    </NavLink>
                  </li>
                );
              })}
          </ul>
        </aside>
      )}

      <ModalKonfirmasi
        open={showExitModal}
        type="warning"
        title="Keluar dari Pengukuran"
        message="Apakah Anda yakin ingin keluar dari halaman pemeriksaan awal? Semua data pemeriksaan yang baru dilakukan akan hilang."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />
    </>
  );
}
