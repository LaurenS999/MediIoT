import { useEffect, useState } from "react";

import "../../styles/device.css";
import useDevice from "../../hooks/useDevice";

import { Search, Wifi, WifiOff } from "lucide-react";

import Pagination from "../../components/common/Pagination";
import { getPaginationItems } from "../../utils/pagination";

export default function AlatKesehatanPage() {
  const {
    devices,
    ambilListDevice,
    currentPage,
    setCurrentPage,
    limitPage,
    totalPage,
  } = useDevice();

  const [search, setSearch] = useState("");
  const page = getPaginationItems(currentPage, totalPage);

  // ======================================================
  // LOAD
  // ======================================================
  useEffect(() => {
    ambilListDevice({
      is_connected: true,
      is_baby: false,
      page: currentPage,
      limit: limitPage,
      search: search,
    });
  }, [currentPage, search]);

  // ======================================================
  // STATS
  // ======================================================
  return (
    <div className="page-container">
      {/* ====================================================== */}
      {/* SEARCH */}
      {/* ====================================================== */}
      <div className="card-custom">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />

          <input
            type="text"
            placeholder="Cari nama, model, MAC Address, IP Address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* ====================================================== */}
      {/* TABLE */}
      {/* ====================================================== */}
      <div className="card-custom">
        <div className="table-wrapper-modern">
          <table className="modern-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Device</th>
                <th>MAC Address</th>
                <th>IP Address</th>
                <th>Gateway ID</th>
                <th>Model</th>
                <th>Activated</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {devices.map((device, index) => (
                <tr key={device.id} className="modern-row">
                  <td>{index + 1}</td>

                  <td>
                    <div className="device-name">{device.name || "-"}</div>
                  </td>

                  <td>
                    <div className="device-mac">
                      {device.mac_address || "-"}
                    </div>
                  </td>
                  <td>
                    <div className="device-mac">{device.ip_address || "-"}</div>
                  </td>

                  <td>
                    <div className="gateway-chip">
                      {device.gateway_id || "-"}
                    </div>
                  </td>

                  <td>{device.model || "-"}</td>

                  <td>
                    <span
                      className={`badge ${
                        device.is_active ? "active" : "inactive"
                      }`}
                    >
                      {device.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        device.is_connected ? "connected" : "disconnected"
                      }`}
                    >
                      {device.is_connected ? (
                        <>
                          <Wifi size={14} />
                          Connected
                        </>
                      ) : (
                        <>
                          <WifiOff size={14} />
                          Disconnected
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}

              {devices.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-table">
                    Device tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          pages={page}
          totalPages={totalPage}
        />
      </div>
    </div>
  );
}
