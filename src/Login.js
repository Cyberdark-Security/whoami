import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        navigate("/");
      } else if (res.status === 401) {
        setError("Usuario y/o contraseña incorrectos");
      } else {
        setError("Hubo un problema al iniciar sesión.");
      }
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <form className="cyber-form" onSubmit={handleSubmit}>
      <div className="cyber-title">Iniciar sesión</div>
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
      <button className="cyber-btn" type="submit">Entrar</button>
      {error && <div className="cyber-error">{error}</div>}
    </form>
  );
}
