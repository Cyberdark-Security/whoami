import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Si ya está autenticado, verificar su role y redirigir
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (token && role) {
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
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

      // ✅ GUARDAR TOKEN Y ROLE
      console.log("✅ Token recibido:", data.token);
      console.log("✅ Role recibido:", data.user.role);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ REDIRIGIR SEGÚN EL ROLE
      if (data.user.role === "admin") {
        console.log("🎉 Admin - Redirigiendo a /admin");
        navigate("/admin", { replace: true });
      } else {
        console.log("👤 User normal - Redirigiendo a /");
        navigate("/", { replace: true });
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
          🔐 Login
        </h1>

        {error && (
          <div style={{
            background: "#FF4444",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
            textAlign: "center",
            fontSize: "14px"
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
            placeholder="admin@example.com"
            style={{
              width: "100%",
              padding: "10px",
              background: "#1a1d24",
              border: "1px solid #44FF44",
              color: "#44FF44",
              borderRadius: "5px",
              fontFamily: "monospace",
              boxSizing: "border-box"
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
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "10px",
              background: "#1a1d24",
              border: "1px solid #44FF44",
              color: "#44FF44",
              borderRadius: "5px",
              fontFamily: "monospace",
              boxSizing: "border-box"
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
            fontSize: "16px"
          }}
        >
          {loading ? "⏳ Entrando..." : "✓ Entrar"}
        </button>

        <p style={{
          textAlign: "center",
          color: "#0CE0FF",
          marginTop: "20px",
          fontSize: "12px"
        }}>
          Admin y usuarios usan este login
        </p>
      </form>
    </div>
  );
}
