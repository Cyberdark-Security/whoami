import React, { useEffect, useState } from "react";

export default function Writeups() {
  const [writeups, setWriteups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ SIN TOKEN - Endpoint público
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

  if (loading) return <div style={{ color: "#39ff14" }}>⏳ Cargando...</div>;
  if (error) return <div style={{ color: "#ff3333" }}>❌ {error}</div>;

  return (
    <main style={{
      maxWidth: 1200,
      margin: "3rem auto",
      background: "#18191b",
      border: "1px solid #39ff14",
      borderRadius: "10px",
      padding: "2em"
    }}>
      <h2 style={{ color: "#39ff14" }}>📝 Writeups Aprobados</h2>

      {writeups.length === 0 ? (
        <div style={{ color: "#9aebc8", textAlign: "center", padding: "2em" }}>
          ✓ No hay writeups disponibles
        </div>
      ) : (
        <table style={{
          width: "100%",
          color: "#fff",
          borderCollapse: "collapse",
          background: "#222"
        }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #39ff14" }}>
              <th style={{ padding: "1em", textAlign: "left" }}>Máquina</th>
              <th style={{ padding: "1em", textAlign: "left" }}>Usuario</th>
              <th style={{ padding: "1em", textAlign: "left" }}>Descripción</th>
              <th style={{ padding: "1em", textAlign: "left" }}>Enviado</th>
            </tr>
          </thead>
          <tbody>
            {writeups.map(w => (
              <tr key={w.id} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: "1em" }}>{w.lab_title || "Sin título"}</td>
                <td style={{ padding: "1em" }}>{w.nombre} {w.apellido}</td>
                <td style={{ padding: "1em" }}>{w.descripcion || "Sin descripción"}</td>
                <td style={{ padding: "1em" }}>
                  {new Date(w.submitted_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
