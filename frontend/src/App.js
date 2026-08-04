import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./page/login/LoginPage";
import AlatKesehatanPage from "./page/alat Kesehatan/AlatKesehatanPage";
import PemeriksaanAwalPage from "./page/pemeriksaan awal/PemeriksaanAwalPage";
import PasienPage from "./page/pasien/PasienPage";
import SetupPemeriksaanAwalPage from "./page/pemeriksaan awal/SetupPemeriksaanAwalPage";
import DetailPasienPage from "./page/pasien/PasienDetailPage";
import RiwayatKunjunganPage from "./page/kunjungan/RiwayatKunjunganPage";
import ProfilePage from "./page/setting/ProfilePage";
import AccessCodePage from "./page/setting/AccessCodePage";
import TidakDitemukan from "./page/tidak ditemukan/TidakDitemukan";
import UserPage from "./page/user/UserPage";
import PemeriksaanDokterPage from "./page/pemeriksaan dokter/PemeriksaanDokterPage";
import DetailPemeriksaanDokter from "./page/pemeriksaan dokter/DetailPemeriksaanDokter";
import DefaultRoute from "./components/common/DefaultRoute";

import AppLayout from "./appLayout";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { ModalInfoProvider } from "./context/ModalInfoProvider";

import ScrollToTop from "./components/common/ScrollToTop";
import PermintaanPemeriksaanPage from "./page/permintaan pemeriksaan/PermintaanPemeriksaanPage";

function App() {
  return (
    <ModalInfoProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />

          {/* CONTENT AREA */}
          <AppLayout>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DefaultRoute />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />

              <Route
                path="/pasien"
                element={
                  <ProtectedRoute
                    allowedRoles={["perawat", "dokter", "super admin"]}
                  >
                    <PasienPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/rekam-medis-saya"
                element={
                  <ProtectedRoute allowedRoles={["pasien", "super admin"]}>
                    <DetailPasienPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pasien/:id"
                element={
                  <ProtectedRoute
                    allowedRoles={["perawat", "dokter", "super admin"]}
                  >
                    <DetailPasienPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/alat-kesehatan"
                element={
                  <ProtectedRoute allowedRoles={["admin", "super admin"]}>
                    <AlatKesehatanPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/setup-kunjungan"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "perawat", "super admin"]}
                  >
                    <SetupPemeriksaanAwalPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/setup-kunjungan/:id_kunjungan"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "perawat", "super admin"]}
                  >
                    <SetupPemeriksaanAwalPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pemeriksaan-awal"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin", "perawat", "super admin"]}
                  >
                    <PemeriksaanAwalPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/riwayat-kunjungan"
                element={
                  <ProtectedRoute
                    allowedRoles={["perawat", "dokter", "super admin"]}
                  >
                    <RiwayatKunjunganPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pemeriksaan-dokter"
                element={
                  <ProtectedRoute allowedRoles={["dokter", "super admin"]}>
                    <PemeriksaanDokterPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pemeriksaan-dokter/:id_kunjungan"
                element={
                  <ProtectedRoute allowedRoles={["dokter", "super admin"]}>
                    <DetailPemeriksaanDokter />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/Access-Code"
                element={
                  <ProtectedRoute allowedRoles={["admin", "super admin"]}>
                    <AccessCodePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/user"
                element={
                  <ProtectedRoute allowedRoles={["admin", "super admin"]}>
                    <UserPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/permintaan-pemeriksaan"
                element={
                  <ProtectedRoute
                    allowedRoles={["perawat", "pasien", "super admin"]}
                  >
                    <PermintaanPemeriksaanPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<TidakDitemukan />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </ModalInfoProvider>
  );
}

export default App;
