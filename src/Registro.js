import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registro({ setUser }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setSuccess("¡Registro exitoso!");
        setTimeout(() => navigate("/"), 1300);
      } else if (res.status === 400) {
        setError(data.error || "Los datos no son válidos.");
      } else {
        setError("No se pudo registrar. Intenta de nuevo.");
      }
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <form className="cyber-form" onSubmit={handleSubmit}>
      <div className="cyber-title">Registro</div>
      <div className="cyber-form-group">
        <label className="cyber-label">Nombre</label>
        <input className="cyber-input" type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
      </div>
      <div className="cyber-form-group">
        <label className="cyber-label">Apellido</label>
        <input className="cyber-input" type="text" value={apellido} onChange={e => setApellido(e.target.value)} required />
      </div>
      <div className="cyber-form-group">
        <label className="cyber-label">Correo electrónico</label>
        <input className="cyber-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="cyber-form-group">
        <label className="cyber-label">Contraseña</label>
        <input className="cyber-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button className="cyber-btn" type="submit">Registrar</button>
      {error && <div className="cyber-error">{error}</div>}
      {success && <div className="cyber-success">{success}</div>}
    </form>
  );
}
