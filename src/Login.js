import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Ajusta la ruta

export default function Login() {
  const { login } = useAuth();
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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        login(data.user);          // Actualiza el contexto global
        navigate("/");             // Redirige al home o dashboard
      } else {
        setError(data.error || "Error en el login");
      }
    } catch (err) {
      setError("Error de conexión");
      console.error(err);
    }
  };

  return (
    <form className="cyber-form" onSubmit={handleSubmit}>
      <div className="cyber-title">Login</div>
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
      <button className="cyber-btn" type="submit">Iniciar sesión</button>
      {error && <div className="cyber-error">{error}</div>}
    </form>
  );
}
