import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ VALIDACIONES
  const validatePassword = (pass) => {
    const minLength = pass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber,
    };
  };

  const passwordValidation = validatePassword(password);

  // ✅ FUNCIÓN: REGISTRO
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones
    if (!nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }
    if (!apellido.trim()) {
      setError("El apellido es requerido");
      return;
    }
    if (!email.includes("@")) {
      setError("Email inválido");
      return;
    }
    if (!passwordValidation.isValid) {
      setError("La contraseña no cumple los requisitos");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ ¡Registro exitoso! Redirigiendo a login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Error en el registro");
        setLoading(false);
      }
    } catch {
      setError("Error de conexión");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">crear cuenta</h1>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nombre">nombre:</label>
            <input
              id="nombre"
              type="text"
              placeholder="juan"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">apellido:</label>
            <input
              id="apellido"
              type="text"
              placeholder="pérez"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">email:</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">contraseña:</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Indicadores de requisitos */}
            <div className="password-requirements">
              <p className={passwordValidation.minLength ? "valid" : "invalid"}>
                {passwordValidation.minLength ? "✓" : "✗"} mínimo 8 caracteres
              </p>
              <p
                className={passwordValidation.hasUpperCase ? "valid" : "invalid"}
              >
                {passwordValidation.hasUpperCase ? "✓" : "✗"} una mayúscula (A-Z)
              </p>
              <p
                className={passwordValidation.hasLowerCase ? "valid" : "invalid"}
              >
                {passwordValidation.hasLowerCase ? "✓" : "✗"} una minúscula (a-z)
              </p>
              <p className={passwordValidation.hasNumber ? "valid" : "invalid"}>
                {passwordValidation.hasNumber ? "✓" : "✗"} un número (0-9)
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">confirmar contraseña:</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword && (
              <p className={password === confirmPassword ? "valid" : "invalid"}>
                {password === confirmPassword ? "✓" : "✗"} las contraseñas
                coinciden
              </p>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading || !passwordValidation.isValid}
          >
            {loading ? "registrando..." : "crear cuenta"}
          </button>
        </form>

        <div className="auth-links">
          <span>¿ya tienes cuenta?</span>
          <Link to="/login" className="link-button">
            inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
