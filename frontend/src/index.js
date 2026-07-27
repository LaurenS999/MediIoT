import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/common/common.css";
import "./styles/common/table.css";
import "./styles/common/button.css";
import "./styles/common/badge.css";
import "./styles/common/searchbox.css";
import "./styles/common/pagination.css";
import "./styles/common/passwordInput.css";
import "./styles/common/modal.css";
import "./styles/notifikasi/notifikasi.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
