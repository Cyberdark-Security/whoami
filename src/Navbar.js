import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

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

        {!user && (
          <>
            <Link to="/login" style={{ color: "#0CE0FF", marginRight: 22, fontWeight: 700, textDecoration: "none" }}>Iniciar sesión</Link>
            <Link to="/registro" style={{ color: "#0CE0FF", fontWeight: 700, textDecoration: "none" }}>Registrarse</Link>
          </>
        )}

        {user && (
          <span style={{ color: "#24D05A", fontWeight: 700, marginLeft: 16 }}>
            Bienvenido, {user.nombre}
            <button onClick={logout} style={{ marginLeft: 12, cursor: "pointer", fontWeight: 700, background: "none", border: "none", color: "#24D05A" }}>
              (Cerrar sesión)
            </button>
          </span>
        )}
      </div>
    </nav>
  );
}
