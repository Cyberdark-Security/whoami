import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      background: "#181A20",
      borderBottom: "2px solid #24D05A",
      fontFamily: "'Fira Mono', 'Consolas', monospace",
      padding: "18px 36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <span style={{ fontWeight: 800, color: "#44FF44", fontSize: 24, letterSpacing: 2 }}>
        WHOAMI
      </span>
      <div>
        <Link to="/" style={{ color: "#0CE0FF", marginRight: 22, fontWeight: 700, textDecoration: "none" }}>Laboratorios</Link>
        <Link to="/ranking" style={{ color: "#0CE0FF", marginRight: 22, fontWeight: 700, textDecoration: "none" }}>Ranking</Link>
        <Link to="/writeups" style={{ color: "#0CE0FF", marginRight: 22, fontWeight: 700, textDecoration: "none" }}>Writeups</Link>
        <Link to="/contacto" style={{ color: "#0CE0FF", marginRight: 22, fontWeight: 700, textDecoration: "none" }}>Contacto</Link>
        <Link to="/login" style={{ color: "#0CE0FF", marginRight: 22, fontWeight: 700, textDecoration: "none" }}>Iniciar sesión</Link>
        <Link to="/registro" style={{ color: "#0CE0FF", fontWeight: 700, textDecoration: "none" }}>Registrarse</Link>
      </div>
    </nav>
  );
}
