import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1=email, 2=code, 3=newpass
  const [forgotCode, setForgotCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Si ya tiene token, redirige
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      if (role === "admin") {
        navigate("/admin/panel", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  // ✅ FUNCIÓN: LOGIN NORMAL
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Email o contraseña incorrectos");
        setLoading(false);
        return;
      }

      // ✅ Guardar en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Actualizar estado
      setUser(data.user);
      console.log("✅ Login exitoso");

      // ✅ Redirigir según role
      if (data.user.role === "admin") {
        navigate("/admin/panel", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Error de conexión con el servidor");
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN: SOLICITAR RECUPERACIÓN (PASO 1)
  const handleForgotStep1 = async (e) => {
    e.preventDefault();
    setError("");
    setForgotLoading(true);

    try {
      const res = await fetch("/api/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Email no encontrado");
        setForgotLoading(false);
        return;
      }

      // Pasar al paso 2
      setForgotStep(2);
      setForgotLoading(false);
    } catch (err) {
      setError("Error al enviar solicitud");
      setForgotLoading(false);
    }
  };

  // ✅ FUNCIÓN: VERIFICAR CÓDIGO (PASO 2)
  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    setError("");
    setForgotLoading(true);

    try {
      const res = await fetch("/api/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, code: forgotCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Código incorrecto");
        setForgotLoading(false);
        return;
      }

      // Pasar al paso 3
      setForgotStep(3);
      setForgotLoading(false);
    } catch (err) {
      setError("Error al verificar código");
      setForgotLoading(false);
    }
  };

  // ✅ FUNCIÓN: CAMBIAR CONTRASEÑA (PASO 3)
  const handleForgotStep3 = async (e) => {
    e.preventDefault();
    setError("");
    setForgotLoading(true);

    if (newPassword.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres");
      setForgotLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: forgotEmail, 
          code: forgotCode,
          newPassword 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al cambiar contraseña");
        setForgotLoading(false);
        return;
      }

      // ✅ Éxito - volver a login normal
      alert("✅ Contraseña cambiad exitosamente. Inicia sesión con tu nueva contraseña.");
      setShowForgot(false);
      setForgotStep(1);
      setForgotEmail("");
      setForgotCode("");
      setNewPassword("");
      setForgotLoading(false);
    } catch (err) {
      setError("Error al cambiar contraseña");
      setForgotLoading(false);
    }
  };

  // ✅ FUNCIÓN: VOLVER ATRÁS EN RECUPERACIÓN
  const handleBackToLogin = () => {
    setShowForgot(false);
    setForgotStep(1);
    setForgotEmail("");
    setForgotCode("");
    setNewPassword("");
    setError("");
  };

  // ============================================
  // 🎨 RENDER
  // ============================================

  return (
    <div className="auth-container">
      {/* ========== FORMULARIO LOGIN NORMAL ========== */}
      {!showForgot ? (
        <div className="auth-box">
          <h1 className="auth-title">iniciar sesión</h1>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
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
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "cargando..." : "iniciar sesión"}
            </button>
          </form>

          {/* Links */}
          <div className="auth-links">
            <button
              type="button"
              className="link-button"
              onClick={() => setShowForgot(true)}
            >
              ¿olvidaste tu contraseña?
            </button>
            <span className="link-separator">•</span>
            <Link to="/registro" className="link-button">
              crear cuenta
            </Link>
          </div>
        </div>
      ) : (
        /* ========== FORMULARIO RECUPERAR CONTRASEÑA ========== */
        <div className="auth-box">
          <h1 className="auth-title">recuperar contraseña</h1>

          {error && <div className="auth-error">{error}</div>}

          {/* PASO 1: SOLICITAR */}
          {forgotStep === 1 && (
            <form onSubmit={handleForgotStep1} className="auth-form">
              <p className="step-info">paso 1/3: verifica tu email</p>
              <div className="form-group">
                <label htmlFor="forgot-email">email:</label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="auth-button"
                disabled={forgotLoading}
              >
                {forgotLoading ? "enviando..." : "enviar código"}
              </button>
            </form>
          )}

          {/* PASO 2: VERIFICAR CÓDIGO */}
          {forgotStep === 2 && (
            <form onSubmit={handleForgotStep2} className="auth-form">
              <p className="step-info">paso 2/3: ingresa el código</p>
              <p className="step-description">
                hemos enviado un código a <strong>{forgotEmail}</strong>
              </p>
              <div className="form-group">
                <label htmlFor="forgot-code">código (6 dígitos):</label>
                <input
                  id="forgot-code"
                  type="text"
                  placeholder="000000"
                  value={forgotCode}
                  onChange={(e) => setForgotCode(e.target.value.slice(0, 6))}
                  maxLength="6"
                  required
                />
              </div>
              <button
                type="submit"
                className="auth-button"
                disabled={forgotLoading}
              >
                {forgotLoading ? "verificando..." : "verificar código"}
              </button>
            </form>
          )}

          {/* PASO 3: NUEVA CONTRASEÑA */}
          {forgotStep === 3 && (
            <form onSubmit={handleForgotStep3} className="auth-form">
              <p className="step-info">paso 3/3: define nueva contraseña</p>
              <div className="form-group">
                <label htmlFor="new-password">nueva contraseña:</label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <p className="password-hint">
                ✓ mínimo 8 caracteres
                {newPassword.length >= 8 && " ✓"}
              </p>
              <button
                type="submit"
                className="auth-button"
                disabled={forgotLoading || newPassword.length < 8}
              >
                {forgotLoading ? "guardando..." : "cambiar contraseña"}
              </button>
            </form>
          )}

          {/* BOTÓN: VOLVER */}
          <div className="auth-links">
            <button
              type="button"
              className="link-button"
              onClick={handleBackToLogin}
            >
              ← volver a login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
