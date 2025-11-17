import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ SI YA TIENE TOKEN, REDIRIGE
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
        setError(data.error || "Error en el login");
        setLoading(false);
        return;
      }

      // ✅ GUARDAR EN LOCALSTORAGE
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ ACTUALIZAR ESTADO
      setUser(data.user);

      console.log("✅ Login exitoso");
      console.log("👤 User role:", data.user.role);

      // ✅ REDIRIGIR SEGÚN ROLE
      if (data.user.role === "admin") {
        console.log("🔐 Redirecting to /admin/panel");
        navigate("/admin/panel", { replace: true });
      } else {
        console.log("👤 Redirecting to /");
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError("Error de conexión con el servidor");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#191b1f",
        fontFamily: "monospace",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#23272F",
          padding: "40px",
          borderRadius: "10px",
          border: "2px solid #44FF44",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1
          style={{
            color: "#39ff14",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          🔐 Login
        </h1>

        {error && (
          <div
            style={{
              background: "#FF4444",
              color: "#fff",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            ❌ {error}
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              color: "#0CE0FF",
              display: "block",
              marginBottom: "5px",
            }}
          >
            📧 Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            style={{
              width: "100%",
              padding: "10px",
              background: "#1a1d24",
              border: "1px solid #44FF44",
              color: "#44FF44",
              borderRadius: "5px",
              fontFamily: "monospace",
              boxSizing: "border-box",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              color: "#0CE0FF",
              display: "block",
              marginBottom: "5px",
            }}
          >
            🔑 Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "10px",
              background: "#1a1d24",
              border: "1px solid #44FF44",
              color: "#44FF44",
              borderRadius: "5px",
              fontFamily: "monospace",
              boxSizing: "border-box",
            }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#44FF44",
            color: "#191b1f",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            fontSize: "16px",
          }}
        >
          {loading ? "⏳ Entrando..." : "✓ Entrar"}
        </button>
      </form>
    </div>
  );
}
