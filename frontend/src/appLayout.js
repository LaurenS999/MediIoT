import { useLocation } from "react-router-dom";

import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";

export default function AppLayout({ children }) {
  const location = useLocation();

  const hideLayout = ["/login"].includes(location.pathname);

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Header />

        <main className="app-body">{children}</main>
      </div>
    </div>
  );
}
