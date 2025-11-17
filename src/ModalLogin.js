import React, { useState } from "react";

export default function ModalLogin({ onLogin, onCancel }) {
  const [email, setEmail] = useState(""); // SIN valor por defecto
  const [password, setPassword] = useState(""); // SIN valor por defecto
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email y contraseña son requeridos");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // Guardar token (NO la contraseña)
        localStorage.setItem("token", data.token);          // ← MISMO QUE Login.js
        localStorage.setItem("role", data.user.role);       // ← MISMO QUE Login.js
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Limpiar campos
        setEmail("");
        setPassword("");
        
        // Callback success
        onLogin(data.user);
      } else {
        setError(data.error || "Error en el login");
      }
    } catch (err) {
      console.error("❌ Error login:", err.message);
      setError("Error de conexión al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Admin Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="cyber-input"
              placeholder="admin@whoami.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="cyber-input"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <div className="modal-buttons">
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? "Iniciando..." : "Ingresar"}
            </button>
            <button 
              type="button" 
              className="btn-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
