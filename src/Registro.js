import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("¡Registro exitoso! Redirigiendo...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Error en el registro");
      }
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <form className="cyber-form" onSubmit={handleSubmit}>
      <div className="cyber-title">Registro</div>

      {/* ✅ CORRECIÓN: Agregar label + id + name */}
      <div className="cyber-form-group">
        <label htmlFor="nombre-input" className="cyber-label">Nombre</label>
        <input
          id="nombre-input"
          name="nombre"
          className="cyber-input"
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
          aria-label="Nombre"
        />
      </div>

      {/* ✅ CORRECIÓN: Agregar label + id + name */}
      <div className="cyber-form-group">
        <label htmlFor="apellido-input" className="cyber-label">Apellido</label>
        <input
          id="apellido-input"
          name="apellido"
          className="cyber-input"
          type="text"
          value={apellido}
          onChange={e => setApellido(e.target.value)}
          required
          aria-label="Apellido"
        />
      </div>

      {/* ✅ CORRECIÓN: Agregar label + id + name */}
      <div className="cyber-form-group">
        <label htmlFor="email-registro-input" className="cyber-label">Correo electrónico</label>
        <input
          id="email-registro-input"
          name="email"
          className="cyber-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          aria-label="Correo electrónico"
        />
      </div>

      {/* ✅ CORRECIÓN: Agregar label + id + name */}
      <div className="cyber-form-group">
        <label htmlFor="password-registro-input" className="cyber-label">Contraseña</label>
        <input
          id="password-registro-input"
          name="password"
          className="cyber-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          aria-label="Contraseña"
        />
      </div>

      <button className="cyber-btn" type="submit">Registrarse</button>
      {error && <div className="cyber-error" role="alert">{error}</div>}
      {success && <div className="cyber-success" role="status">{success}</div>}
    </form>
  );
}
