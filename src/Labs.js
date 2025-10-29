import React, { useEffect, useState } from "react";
import AgregarLaboratorio from "./AgregarLaboratorio";  // importa el nuevo componente

export default function Labs({ user }) {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para recargar laboratorios después de agregar uno nuevo
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
      maxWidth: 900,
      margin: "3rem auto",
      background: "#18191b",
      border: "1px solid #39ff14",
      borderRadius: "10px",
      padding: "2em"
    }}>
      <h2 style={{ color: "#39ff14" }}>Laboratorios</h2>

      {/* Solo mostrar formulario a usuarios con rol admin */}
      {user && user.role === "admin" && (
        <AgregarLaboratorio onLabAdded={recargarLaboratorios} />
      )}

      {labs.length === 0 && <p style={{ color: "#fbd" }}>No hay laboratorios publicados.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {labs.map(l => (
          <li key={l.id} style={{
            background: "#23272f",
            borderRadius: "6px",
            marginBottom: "14px",
            padding: "12px 20px",
            color: "#fff"
          }}>
            <div style={{ fontSize: "1.2em", color: "#0ff", fontWeight: "bold" }}>
              {l.title}
            </div>
            <div style={{ color: "#aed", fontSize: "1em" }}>
              {l.description}
            </div>
            <div style={{ fontSize: "0.85em", color: "#aaa", marginTop: 2 }}>
              Publicado: {new Date(l.created_at).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
