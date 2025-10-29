import React, { useEffect, useState } from "react";

export default function Writeups() {
  const [writeups, setWriteups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/writeups-aprobados")
      .then(res => res.json())
      .then(data => {
        setWriteups(data.writeups || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "#39ff14" }}>Cargando...</div>;

  return (
    <main style={{
      maxWidth: 900,
      margin: "3rem auto",
      background: "#18191b",
      border: "1px solid #39ff14",
      borderRadius: "10px",
      padding: "2em"
    }}>
      <h2 style={{ color: "#39ff14" }}>Writeups aprobados</h2>
      <table style={{
        width: "100%",
        color: "#fff",
        borderCollapse: "collapse",
        background: "#222"
      }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #39ff14" }}>
            <th>Fecha</th>
            <th>Máquina</th>
            <th>Registrado por</th>
            <th>Enlace</th>
          </tr>
        </thead>
        <tbody>
          {writeups.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", color: "#9aebc8" }}>
                Aún no se han publicado writeups.
              </td>
            </tr>
          )}
          {writeups.map(w => (
            <tr key={w.id} style={{ borderBottom: "1px solid #333" }}>
              <td>{new Date(w.fecha).toLocaleDateString()}</td>
              <td>{w.maquina}</td>
              <td>{w.usuario}</td>
              <td>
                <a href={w.enlace} target="_blank" rel="noopener noreferrer" style={{ color: "#0ff", fontWeight: 600 }}>
                  Ver
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
