import React, { useEffect, useState } from "react";

export default function Writeups() {
  const [writeups, setWriteups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/writeups")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("✅ Writeups públicos recibidos:", data);
        setWriteups(data);
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        console.error("❌ Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ✅ Función helper para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    try {
      const isoDate = dateString.replace(" ", "T").replace("+00", "Z");
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) {
        return "Fecha inválida";
      }
      return date.toLocaleDateString("es-ES");
    } catch (e) {
      return "Error en fecha";
    }
  };

  // ✅ Función para validar y abrir link
  const handleEvidenceClick = (evidence, e) => {
    e.preventDefault();
    
    if (!evidence || evidence.trim() === "") {
      alert("⚠️ No hay evidencia disponible para este writeup");
      return;
    }

    // Si es una URL válida, abre en nueva pestaña
    if (evidence.startsWith("http://") || evidence.startsWith("https://")) {
      window.open(evidence, "_blank", "noopener,noreferrer");
    } else {
      alert("❌ URL inválida: " + evidence);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        color: "#39ff14", 
        textAlign: "center", 
        padding: "2em",
        fontSize: "1.2em"
      }}>
        ⏳ Cargando writeups...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        color: "#ff3333", 
        textAlign: "center", 
        padding: "2em",
        fontSize: "1.2em"
      }}>
        ❌ Error: {error}
      </div>
    );
  }

  return (
    <main style={{
      maxWidth: 1200,
      margin: "3rem auto",
      background: "#18191b",
      border: "2px solid #39ff14",
      borderRadius: "10px",
      padding: "2em"
    }}>
      <h2 style={{ 
        color: "#39ff14",
        marginTop: 0,
        textAlign: "center"
      }}>
        📝 Writeups Aprobados
      </h2>

      {writeups.length === 0 ? (
        <div style={{ 
          color: "#9aebc8", 
          textAlign: "center", 
          padding: "2em",
          fontSize: "1.1em"
        }}>
          ✓ No hay writeups disponibles
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            color: "#fff",
            borderCollapse: "collapse",
            background: "#222"
          }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #39ff14" }}>
                <th style={{ 
                  padding: "1em", 
                  textAlign: "left",
                  color: "#39ff14"
                }}>
                  Máquina
                </th>
                <th style={{ 
                  padding: "1em", 
                  textAlign: "left",
                  color: "#39ff14"
                }}>
                  Usuario
                </th>
                <th style={{ 
                  padding: "1em", 
                  textAlign: "left",
                  color: "#39ff14"
                }}>
                  Descripción
                </th>
                <th style={{ 
                  padding: "1em", 
                  textAlign: "left",
                  color: "#39ff14"
                }}>
                  Enviado
                </th>
              </tr>
            </thead>
            <tbody>
              {writeups.map((w, index) => {
                const hasEvidence = w.evidence && w.evidence.trim() !== "";
                
                return (
                  <tr 
                    key={w.id} 
                    style={{ 
                      borderBottom: "1px solid #333",
                      backgroundColor: index % 2 === 0 ? "#1a1a1c" : "#222"
                    }}
                  >
                    <td style={{ 
                      padding: "1em",
                      fontWeight: "bold",
                      color: "#9aebc8"
                    }}>
                      {w.lab_title || "Sin título"}
                    </td>
                    <td style={{ padding: "1em" }}>
                      {w.nombre} {w.apellido}
                    </td>
                    <td style={{ padding: "1em" }}>
                      {hasEvidence ? (
                        <button
                          onClick={(e) => handleEvidenceClick(w.evidence, e)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#39ff14",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "1em",
                            padding: 0,
                            textDecoration: "none"
                          }}
                          onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                          onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                        >
                          Ver evidencia 🔗
                        </button>
                      ) : (
                        <span style={{ color: "#999", fontSize: "0.9em" }}>
                          Sin evidencia
                        </span>
                      )}
                    </td>
                    <td style={{ 
                      padding: "1em",
                      color: "#9aebc8"
                    }}>
                      {formatDate(w.submitted_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{
        marginTop: "2em",
        padding: "1em",
        background: "#1a1a1c",
        borderLeft: "3px solid #39ff14",
        color: "#9aebc8",
        fontSize: "0.9em"
      }}>
        Total de writeups aprobados: <strong style={{ color: "#39ff14" }}>{writeups.length}</strong>
      </div>
    </main>
  );
}
