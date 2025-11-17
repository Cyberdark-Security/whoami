import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [writeups, setWriteups] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      setAdmin(true);
      fetchWriteups(user.id);
    } else {
      navigate("/admin/login", { replace: true });
    }
    setLoading(false);
  }, [navigate]);

  const fetchWriteups = async (userId) => {
    try {
      const response = await fetch("/api/writeups", {
        headers: {
          "x-user-id": userId,
        },
      });

      if (!response.ok) throw new Error("Error al obtener writeups");

      const data = await response.json();
      setWriteups(data.writeups || []);
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudieron cargar los writeups");
    }
  };

  const handleApprove = async (writeupId) => {
    try {
      const response = await fetch("/api/writeups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writeupId, aprobar: true }),
      });

      if (response.ok) {
        alert("✓ Writeup aprobado!");
        const user = JSON.parse(localStorage.getItem("user"));
        fetchWriteups(user.id);
      }
    } catch (err) {
      alert("Error al aprobar");
    }
  };

  const handleReject = async (writeupId) => {
    try {
      const response = await fetch("/api/writeups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writeupId, aprobar: false }),
      });

      if (response.ok) {
        alert("✗ Writeup rechazado");
        const user = JSON.parse(localStorage.getItem("user"));
        fetchWriteups(user.id);
      }
    } catch (err) {
      alert("Error al rechazar");
    }
  };

  if (loading) return null;
  if (!admin) return null;

  return (
    <main style={{ padding: "40px 20px", minHeight: "100vh" }}>
      <h1 style={{
        color: "#39ff14",
        fontFamily: "monospace",
        margin: "2em 0",
        fontWeight: 900,
        fontSize: "2.2em"
      }}>
        📋 Revisión de Writeups Pendientes
      </h1>

      {error && (
        <div style={{
          color: "#ff3366",
          padding: "15px",
          margin: "20px 0",
          border: "1px solid #ff3366",
          borderRadius: "5px",
          fontFamily: "monospace"
        }}>
          {error}
        </div>
      )}

      {writeups.length === 0 ? (
        <div style={{
          color: "#0CE0FF",
          padding: "30px",
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: "1.1em"
        }}>
          ✓ No hay writeups pendientes
        </div>
      ) : (
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gap: "20px"
        }}>
          {writeups.map((writeup) => (
            <div
              key={writeup.id}
              style={{
                background: "#23272F",
                border: "2px solid #44FF44",
                borderLeft: "6px solid #44FF44",
                borderRadius: "12px",
                padding: "20px",
                fontFamily: "monospace"
              }}
            >
              <div style={{ marginBottom: "15px" }}>
                <h3 style={{
                  color: "#44FF44",
                  margin: "0 0 10px 0",
                  fontSize: "1.3em"
                }}>
                  {writeup.lab || "Lab sin nombre"}
                </h3>

                <p style={{ margin: "8px 0", color: "#0CE0FF" }}>
                  <strong>👤 Usuario:</strong> {writeup.nombre || "Desconocido"}
                </p>

                <p style={{ margin: "8px 0", color: "#0CE0FF" }}>
                  <strong>📅 Enviado:</strong>{" "}
                  {new Date(writeup.fecha_envio).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p style={{ margin: "8px 0" }}>
                  <a
                    href={writeup.writeup_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#0CE0FF",
                      textDecoration: "underline",
                      fontSize: "1em"
                    }}
                  >
                    🔗 Ver Writeup
                  </a>
                </p>
              </div>

              <div style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
                flexWrap: "wrap"
              }}>
                <button
                  onClick={() => handleApprove(writeup.id)}
                  style={{
                    background: "#44FF44",
                    color: "#191b1f",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    fontSize: "1em",
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                  onMouseOver={(e) => e.target.style.background = "#24D05A"}
                  onMouseOut={(e) => e.target.style.background = "#44FF44"}
                >
                  ✓ Aprobar
                </button>

                <button
                  onClick={() => handleReject(writeup.id)}
                  style={{
                    background: "#FF4444",
                    color: "#fff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    fontSize: "1em",
                    cursor: "pointer",
                    transition: "background 0.3s",
                  }}
                  onMouseOver={(e) => e.target.style.background = "#DD2222"}
                  onMouseOut={(e) => e.target.style.background = "#FF4444"}
                >
                  ✗ Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
