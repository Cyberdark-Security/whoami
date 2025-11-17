import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Si ya está autenticado, redirigir
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (token && role === "admin") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error en el login");
        return;
      }

      // ✅ GUARDAR TOKEN Y ROLE EN LOCALSTORAGE
      console.log("✅ Token recibido:", data.token);
      console.log("✅ Role recibido:", data.user.role);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ REDIRIGIR AL PANEL DE ADMIN
      if (data.user.role === "admin") {
        console.log("🎉 Admin detectado - Redirigiendo a /admin");
        window.location.href = "/admin"; // Recarga completamente
      } else {
        console.log("❌ No es admin - Redirigiendo a /");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "#191b1f",
      fontFamily: "monospace"
    }}>
      <form onSubmit={handleLogin} style={{
        background: "#23272F",
        padding: "40px",
        borderRadius: "10px",
        border: "2px solid #44FF44",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h1 style={{ color: "#39ff14", marginBottom: "30px", textAlign: "center" }}>
          🔐 Admin Login
        </h1>

        {error && (
          <div style={{
            background: "#FF4444",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            ❌ {error}
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#0CE0FF", display: "block", marginBottom: "5px" }}>
            📧 Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              background: "#1a1d24",
              border: "1px solid #44FF44",
              color: "#44FF44",
              borderRadius: "5px",
              fontFamily: "monospace"
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ color: "#0CE0FF", display: "block", marginBottom: "5px" }}>
            🔑 Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              background: "#1a1d24",
              border: "1px solid #44FF44",
              color: "#44FF44",
              borderRadius: "5px",
              fontFamily: "monospace"
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
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? "⏳ Entrando..." : "✓ Entrar"}
        </button>
      </form>
    </div>
  );
}
