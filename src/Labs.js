import React, { useEffect, useState } from "react";

// Simula la función para enviar writeup o evidencia, cámbiala según tu backend
const enviarEvidencia = labId => alert(`Subir evidencia para lab ${labId}`);

export default function Labs({ user }) {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  const recargarLaboratorios = () => {
    setLoading(true);
    fetch("/api/labs")
      .then(res => res.json())
      .then(data => {
        setLabs(data.labs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    recargarLaboratorios();
  }, []);

  if (loading) return <div style={{ color: "#39ff14" }}>Cargando laboratorios...</div>;

  return (
    <main style={{
      maxWidth: 950,
      margin: "2em auto",
      background: "#18191b",
      border: "1.5px solid #39ff14",
      borderRadius: "14px",
      padding: "2.4em",
      boxSizing: "border-box"
    }}>
      <h1 style={{
        color: "#39ff14",
        fontFamily: "monospace",
        fontWeight: 900,
        fontSize: "2.4em",
        margin: "0 0 28px 0",
        letterSpacing: "2px"
      }}>
        Laboratorios Dockerizados de Pentesting
      </h1>

      {labs.length === 0 && <p style={{ color: "#fbd" }}>No hay laboratorios publicados.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {labs.map((l, idx) => (
          <section
            key={l.id}
            style={{
              background: "#21242a",
              padding: "28px 32px 22px 32px",
              borderRadius: "18px",
              border: "3.5px solid #39ff14",
              marginBottom: 0,
              fontFamily: "monospace"
            }}>
            <div style={{
              color: "#71e35b",
              fontSize: "2em",
              fontWeight: 800,
              marginBottom: "8px",
              letterSpacing: "1px"
            }}>
              {`Lab ${idx + 1}: ${l.title}`}
            </div>
            <div style={{
              fontWeight: "bold",
              color: "#b8ffcb",
              fontSize: "1.05em",
              marginBottom: "12px"
            }}>
              Publicado: {new Date(l.created_at).toLocaleDateString()}
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <a
                href={l.megalink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#39ff14",
                  color: "#15191b",
                  fontWeight: 900,
                  border: "none",
                  borderRadius: "7px",
                  padding: "6px 19px",
                  fontFamily: "monospace",
                  textDecoration: "underline",
                  fontSize: "1.1em",
                  marginRight: 4,
                  letterSpacing: ".5px"
                }}>
                Descargar
              </a>
              {/* Mostrar solo si hay usuario logueado */}
              {user && (
                <button
                  onClick={() => enviarEvidencia(l.id)}
                  style={{
                    background: "#71ff84",
                    color: "#21242a",
                    fontWeight: 900,
                    border: "none",
                    borderRadius: "7px",
                    padding: "6px 20px",
                    fontFamily: "monospace",
                    fontSize: "1em",
                    cursor: "pointer",
                    boxShadow: "0 1px 7px #101c",
                  }}>
                  Enviar evidencia
                </button>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
