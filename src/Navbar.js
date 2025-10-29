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
    <nav className="navbar-custom">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">WHOAMI</Link>
      </div>
      <div className="navbar-right">
        <Link to="/labs">Laboratorios</Link>
        <Link to="/ranking">Ranking</Link>
        <Link to="/writeups">Writeups</Link>
        <Link to="/contacto">Contacto</Link>
        <Link to="/admin/login">Admin</Link>

        {!user && (
          <>
            <span className="navbar-link" onClick={() => navigate("/login")}>
              Iniciar sesión
            </span>
            <Link to="/registro" className="navbar-link">
              Registrarse
            </Link>
          </>
        )}
        {user && (
          <>
            <span style={{ fontWeight: "bold", color: "#fff" }}>
              Hola, {user.nombre}
            </span>
            <span
              className="navbar-link navbar-dropdown"
              onClick={handleSesionClick}
            >
              Sesión ▼
              {menuOpen && (
                <div className="navbar-dropdown-menu">
                  <button onClick={handleLogout}>Cerrar sesión</button>
                </div>
              )}
            </span>
          </>
        )}
      </div>
    </nav>
  );
}
