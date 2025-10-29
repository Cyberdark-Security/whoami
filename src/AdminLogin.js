import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (onLogin) onLogin(data.user);
        navigate("/admin/panel", { replace: true }); // Redirige directamente al panel admin
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch {
      setError("Error de conexión");
    }
  }

  return (
    <form className="cyber-form" onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "64px auto" }}>
      <div className="cyber-title">Login Administrador</div>
      <div className="cyber-form-group">
        <label className="cyber-label">Email</label>
        <input className="cyber-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="cyber-form-group">
        <label className="cyber-label">Contraseña</label>
        <input className="cyber-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button className="cyber-btn" type="submit">Entrar</button>
      {error && <div className="cyber-error">{error}</div>}
    </form>
  );
}
