import React, { useState, useRef, useEffect } from "react";

const navLink = {
  color: "#0CE0FF",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 16,
  marginRight: 20,
  padding: "4px 0",
  transition: "color 0.2s"
};

const navButton = {
  background: "linear-gradient(90deg, #24D05A 60%, #0CE0FF 100%)",
  color: "#181A20",
  fontWeight: 700,
  border: "none",
  borderRadius: 4,
  padding: "7px 18px",
  boxShadow: "0 2px 8px #0CE0FF44",
  cursor: "pointer",
  fontSize: 16,
  marginLeft: 16
};

export default function Navbar({ user, setUser }) {
  const [showLogout, setShowLogout] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!showLogout) return;
    function handleOutsideClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowLogout(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showLogout]);

  return (
    <nav style={{
      background: "#181A20",
      padding: "16px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "2px solid #24D05A",
      minHeight: 56
    }}>
      <span style={{ fontWeight: 800, color: "#44FF44", fontSize: 24, letterSpacing: 2 }}>
        WHOAMI
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <a href="#" style={navLink}>Laboratorios</a>
        <a href="#" style={navLink}>Ranking</a>
        <a href="#" style={navLink}>Writeups</a>
        <a href="#" style={navLink}>Contacto</a>
        <div ref={containerRef} style={{ position: "relative", marginLeft: 18 }}>
          {user ? (
            <span
              style={{
                color: "#c483ec",
                cursor: "pointer",
                fontWeight: "bold",
                display: "inline-block"
              }}
              onClick={() => setShowLogout((s) => !s)}
            >
              <span role="img" aria-label="user">👤</span> {user.username}
              {showLogout && (
                <button
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 30,
                    background: "#23272F",
                    color: "#0CE0FF",
                    border: "1px solid #44FF44",
                    padding: "6px 18px",
                    borderRadius: 4,
                    cursor: "pointer",
                    zIndex: 200,
                    minWidth: 120,
                  }}
                  onClick={() => {
                    setShowLogout(false);
                    setUser(null);
                  }}
                >
                  Cerrar sesión
                </button>
              )}
            </span>
          ) : (
            <span style={{ color: "#777" }}>Invitado</span>
          )}
        </div>
      </div>
    </nav>
  );
}
