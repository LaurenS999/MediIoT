import React, { useEffect } from "react";

export default function ModalInfo({ isOpen, onClose, message }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          minWidth: "300px",
          maxWidth: "400px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "12px",
            fontSize: "22px",
          }}
        >
          Informasi
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "#555",
            whiteSpace: "pre-line",
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
