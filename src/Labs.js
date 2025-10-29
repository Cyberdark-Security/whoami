import React, { useEffect, useState } from "react";

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/labs")
      .then(res => res.json())
      .then(data => { setLabs(data.labs || []); setLoading(false); })
      .catch(() => setLoading(false));
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
            <div style={{ fontSize: "1.2em", color: "#0ff", fontWeight: "bold" }}>{l.title}</div>
            <div style={{ color: "#aed", fontSize: "1em" }}>{l.description}</div>
            <div style={{ fontSize: "0.85em", color: "#aaa", marginTop: 2 }}>
              Publicado: {new Date(l.created_at).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
