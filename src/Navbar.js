import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/");
  }

  function handleSesionClick() {
    if (user) {
      setMenuOpen(!menuOpen);
    } else {
      navigate("/login");
    }
  }

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 2vw"
    }}>
      {/* Zona izquierda */}
      <div style={{ display: "flex", gap: "18px" }}>
        <Link to="/" style={{ fontWeight: "bold", color: "#39ff14" }}>WHOAMI</Link>
      </div>
      {/* Zona derecha (centrar cada elemento con gap) */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link to="/labs" className="navbar-link">Laboratorios</Link>
        <Link to="/ranking" className="navbar-link">Ranking</Link>
        <Link to="/writeups" className="navbar-link">Writeups</Link>
        <Link to="/contacto" className="navbar-link">Contacto</Link>
        <Link to="/admin/login" className="navbar-link">Admin</Link>

        {/* Si no está logueado, muestra ambos */}
        {!user &&
          <>
            <span
              className="navbar-link"
              style={{ cursor: "pointer", color: "#0ff", fontWeight: 700 }}
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </span>
            <Link to="/registro" className="navbar-link" style={{ fontWeight: 700 }}>
              Registrarse
            </Link>
          </>
        }
        {/* Si está logueado, nombre y menú sesión */}
        {user &&
          <>
            <span style={{ fontWeight: "bold", color: "#fff" }}>
              Hola, {user.nombre}
            </span>
            <span
              style={{
                color: "#0ff",
                fontWeight: 700,
                cursor: "pointer",
                userSelect: "none",
                position: "relative"
              }}
              onClick={handleSesionClick}
            >
              Sesión ▼
              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "28px",
                    right: 0,
                    background: "#222",
                    border: "1px solid #0f0",
                    borderRadius: "4px",
                    padding: "8px 16px",
                    zIndex: 99,
                  }}
                >
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#f22",
                      fontWeight: 700,
                      fontSize: "1em",
                      cursor: "pointer",
                    }}
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </span>
          </>
        }
      </div>
    </nav>
  );
}
