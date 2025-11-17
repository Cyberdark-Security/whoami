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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        setError(data.error || "Error en el login");
      }
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <form className="cyber-form" onSubmit={handleSubmit}>
      <div className="cyber-title">Login</div>
      
      {/* ✅ CORRECIÓN: Agregar label + id + name */}
      <div className="cyber-form-group">
        <label htmlFor="email-input" className="cyber-label">Correo electrónico</label>
        <input
          id="email-input"
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
        <label htmlFor="password-input" className="cyber-label">Contraseña</label>
        <input
          id="password-input"
          name="password"
          className="cyber-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          aria-label="Contraseña"
        />
      </div>

      <button className="cyber-btn" type="submit">Iniciar sesión</button>
      {error && <div className="cyber-error" role="alert">{error}</div>}
    </form>
  );
}
