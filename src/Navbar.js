import React from "react";
import { Link, useNavigate } from "react-router-dom";

function isAdminLogged() {
  const token = localStorage.getItem("token");
  return !!token;
}

export default function Navbar() {
  const navigate = useNavigate();

  function logoutAdmin() {
    localStorage.removeItem("token");
    navigate("/admin");
    window.location.reload();
  }

  return (
    <nav style={{
      background: "#181A20",
      borderBottom: "2px solid #24D05A",
      padding: "18px 36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontFamily: "'Fira Mono', monospace"
    }}>
      <div style={{
        fontFamily: "'Fira Mono', monospace",
        fontWeight: "bold",
        color: "#44FF44",
        fontSize: "24px",
        letterSpacing: "2px"
      }}>WHOAMI</div>
      <div>
        <Link to="/" style={{ color: "#0CE0FF", marginRight: 22, fontWeight: 700, textDecoration: "none" }}>Laboratorios</Link>
        <Link to="/ranking" style={{ color: "#0CE0FF", marginRight: 22, fontWeight: 700, textDecoration: "none" }}>Ranking</Link>
        <Link to="/writeups" style={{ color: "#0CE0FF", marginRight: 22, fontWeight: 700, textDecoration: "none" }}>Writeups</Link>
        <Link to="/contacto" style={{ color: "#0CE0FF", marginRight: 22, fontWeight: 700, textDecoration: "none" }}>Contacto</Link>
        <Link to="/login" style={{ color: "#0CE0FF", marginRight: 22, fontWeight: 700, textDecoration: "none" }}>Iniciar sesión</Link>
        <Link to="/registro" style={{ color: "#0CE0FF", fontWeight: 700, marginRight: 22, textDecoration: "none" }}>Registrarse</Link>
        {!isAdminLogged() && (
          <Link to="/admin/login" style={{ color: "#24D05A", fontWeight: 700, textDecoration: "none" }}>Admin</Link>
        )}
        {isAdminLogged() && (
          <>
            <Link to="/admin/panel" style={{ color: "#24D05A", fontWeight: 700, marginRight: 14, textDecoration: "none" }}>Panel Admin</Link>
            <button onClick={logoutAdmin} style={{ color: "#F44336", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Cerrar admin</button>
          </>
        )}
      </div>
    </nav>
  );
}
