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
        navigate("/");
      } else {
        setError(data.error || "Error al registrar");
        if (data.detail) console.log("Backend detail:", data.detail);
      }
    } catch (err) {
      setError("Error de conexión");
      console.log("Fetch error:", err);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Apellido:</label>
          <input type="text" value={apellido} onChange={e => setApellido(e.target.value)} required />
        </div>
        <div>
          <label>Correo electrónico:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Registrar</button>
        {error && <div style={{ color: "#f44", marginTop: 10 }}>{error}</div>}
        {success && <div style={{ color: "#24D05A", marginTop: 10 }}>{success}</div>}
      </form>
    </div>
  );
}
