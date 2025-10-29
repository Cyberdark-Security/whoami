import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registro({ setUser }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, password })
      });
      const data = await res.json();
      console.log("Respuesta backend", data, res.status, res.ok);

      // Debug extra
      if (res.ok && data.user) {
        console.log("Registrado OK, guardando usuario:", data.user);
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else if (res.status === 409) {
        setError("El correo ya está registrado.");
        console.log("Error: correo duplicado");
      } else {
        setError(data.error || "Hubo un error en el registro.");
        console.log("Error genérico del backend:", data.error);
      }
    } catch (err) {
      setError("Error de conexión");
      console.error("Error durante registro:", err);
    }
  };

  return (
    <form className="cyber-form" onSubmit={handleSubmit}>
      <div className="cyber-title">Registro</div>
      <div className="cyber-form-group">
        <label className="cyber-label">Nombre</label>
        <input
          className="cyber-input"
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
      </div>
      <div className="cyber-form-group">
        <label className="cyber-label">Apellido</label>
        <input
          className="cyber-input"
          type="text"
          value={apellido}
          onChange={e => setApellido(e.target.value)}
          required
        />
      </div>
      <div className="cyber-form-group">
        <label className="cyber-label">Correo electrónico</label>
        <input
          className="cyber-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="cyber-form-group">
        <label className="cyber-label">Contraseña</label>
        <input
          className="cyber-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      <button className="cyber-btn" type="submit">Registrar</button>
      {error && <div className="cyber-error">{error}</div>}
    </form>
  );
}
