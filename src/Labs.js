import React, { useEffect, useState } from "react";
import AgregarLaboratorio from "./AgregarLaboratorio";

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
      width: "100%",
      maxWidth: 900,
      margin: "3rem auto",
      background: "#18191b",
      border: "1px solid #39ff14",
      borderRadius: "10px",
      padding: "2em",
      boxSizing: "border-box",
      overflowX: "auto"
    }}>
      <h2 style={{ color: "#39ff14" }}>Laboratorios</h2>

      {/* Enlace visible para admins */}
      {user && user.role === "admin" && (
        <div style={{ marginBottom: 18 }}>
          <a
            href="/admin/panel"
            style={{
              color: "#39ff14",
              fontWeight: "bold",
              textDecoration: "underline",
              fontSize: "1.1em"
            }}
          >
            Ir al Panel de Administración
          </a>
        </div>
      )}

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
            <div style={{ fontSize: "0.85em", color: "#aaa", marginTop: 2 }}>
              Publicado: {new Date(l.created_at).toLocaleDateString()}
            </div>
            {!!l.megalink && (
              <div style={{ marginTop: 8 }}>
                <a
                  href={l.megalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#39ff14", textDecoration: "underline", wordBreak: "break-all" }}
                >
                  Descargar laboratorio
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
