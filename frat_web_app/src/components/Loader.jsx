import React from "react";

export default function Loader({ message = "Authenticating...", subtitle = null }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.88)",
        zIndex: 2000,
        fontFamily: "Inter, sans-serif",
        animation: "fadeIn 0.8s ease forwards",
      }}
    >
      {/* Fading Text */}
      <h2
        style={{
          fontWeight: 800,
          fontSize: "1.6rem",
          letterSpacing: "0.5px",
          color: "#7a113b",
          marginBottom: "10px",
          animation: "fadePulse 2s ease-in-out infinite",
        }}
      >
        {message}
      </h2>

      {/* Spinner */}
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          border: "5px solid transparent",
          borderTop: "5px solid #7a113b", // maroon
          borderRight: "5px solid #f8bbd0", // light pink
          borderBottom: "5px solid #b0c7f1", // soft blue
          animation: "spin 1s linear infinite, glow 1.5s ease-in-out infinite alternate",
          margin: "16px auto",
        }}
      ></div>

      {subtitle && (
        <p style={{ color: "#4b4b4b", marginTop: "12px", fontSize: "0.95rem" }}>
          {subtitle}
        </p>
      )}

      {/* Inline Animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadePulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 8px rgba(122, 17, 59, 0.25),
                        0 0 12px rgba(248, 187, 208, 0.25);
          }
          100% {
            box-shadow: 0 0 14px rgba(122, 17, 59, 0.45),
                        0 0 20px rgba(176, 199, 241, 0.4);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}


