import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
  // ✅ Limpiar TODO localStorage
  localStorage.clear();  // O uno por uno:
  // localStorage.removeItem("token");
  // localStorage.removeItem("role");
  // localStorage.removeItem("user");
  // localStorage.removeItem("admin_token");
  // localStorage.removeItem("admin_user");
  
  // Actualizar estado
  setUser(null);
  setMenuOpen(false);
  
  // Navegar al inicio
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
      width: '100%',
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 2vw",
      borderBottom: "2px solid #39ff14",
      fontFamily: 'Fira Mono, monospace'
    }}>
      {/* IZQUIERDA */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={{
          color: "#39ff14",
          fontWeight: "bold",
          fontSize: "1.5em",
          textDecoration: "none",
          marginRight: "14px"
        }}>
          WHOAMI
        </Link>
      </div>

      {/* DERECHA */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "18px",
        fontWeight: "bold"
      }}>
        <Link to="/labs" style={{ color: "#00ffff", textDecoration: "none" }}>
          Laboratorios
        </Link>
        <Link to="/ranking" style={{ color: "#00ffff", textDecoration: "none" }}>
          Ranking
        </Link>
        <Link to="/writeups" style={{ color: "#00ffff", textDecoration: "none" }}>
          Writeups
        </Link>
        <Link to="/contacto" style={{ color: "#00ffff", textDecoration: "none" }}>
          Contacto
        </Link>

        {/* ⚙️ BOTÓN ADMIN - SOLO PARA ADMINS */}
        {user && user.role === "admin" && (
          <Link 
            to="/admin/panel" 
            style={{ 
              color: "#39ff14", 
              textDecoration: "none", 
              fontWeight: 900,
              fontSize: "1.1em"
            }}
          >
            ⚙️ Admin
          </Link>
        )}

        {/* LOGIN / REGISTRO - SI NO ESTÁ LOGUEADO */}
        {!user && (
          <>
            <span 
              style={{ color: "#00ffff", cursor: "pointer", marginLeft: "6px" }} 
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </span>
            <Link 
              to="/registro" 
              style={{
                color: "#00ffff", 
                marginLeft: "6px", 
                textDecoration: "none"
              }}
            >
              Registrarse
            </Link>
          </>
        )}

        {/* MENÚ SESIÓN - SI ESTÁ LOGUEADO */}
        {user && (
          <>
            <span style={{ marginLeft: "12px", color: "#fff" }}>
              Hola, {user.nombre}
            </span>
            <span
              style={{
                color: "#00ffff",
                cursor: "pointer",
                userSelect: "none",
                position: "relative",
                marginLeft: "10px"
              }}
              onClick={handleSesionClick}
            >
              Sesión ▼
              {menuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "26px",
                    right: 0,
                    background: "#222",
                    border: "1px solid #0f0",
                    borderRadius: "4px",
                    padding: "7px 22px",
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
        )}
      </div>
    </nav>
  );
}
