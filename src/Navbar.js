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
      setMenuOpen(!menuOpen); // despliega/cierra menú
    } else {
      navigate("/login");
    }
  }

  return (
    <nav style={{ display: "flex", alignItems: "center", gap: "15px" }}>
      <Link to="/">Home</Link>
      <Link to="/ranking">Ranking</Link>
      <Link to="/labs">Labs</Link>
      <Link to="/admin/login">Admin</Link>

      {/* Si no hay usuario, muestra los links normales */}
      {!user && (
        <>
          <span
            className="navbar-link"
            style={{ cursor: "pointer", color: "#0ff" }}
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </span>
          <Link to="/registro">Registrarse</Link>
        </>
      )}

      {/* Si hay usuario, reemplaza con menú desplegable de sesión */}
      {user && (
        <>
          <span style={{ marginLeft: "10px" }}>Hola, {user.nombre}</span>
          <span
            style={{
              marginLeft: "10px",
              color: "#0ff",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={handleSesionClick}
          >
            Sesión ▼
            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "22px",
                  left: 0,
                  background: "#222",
                  border: "1px solid #0f0",
                  padding: 5,
                  zIndex: 10
                }}
              >
                <button onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </span>
        </>
      )}
    </nav>
  );
}
