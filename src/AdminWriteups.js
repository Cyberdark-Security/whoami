import React, { useEffect, useState } from "react";

export default function AdminWriteups() {
  const [writeups, setWriteups] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar writeups pendientes al montar
  useEffect(() => {
    fetchPendingWriteups();
  }, []);

  async function fetchPendingWriteups() {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token"); // Token del admin, guardado al login
      const res = await fetch('/api/admin/writeups-pending', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error("Error cargando writeups");
      const data = await res.json();
      setWriteups(data.writeups);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(userLabId, approve) {
    setError("");
    try {
      const token = localStorage.getItem("token"); // Token del admin
      const res = await fetch('/api/admin/approve-writeup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_lab_id: userLabId,
          approve
        })
      });
      if (!res.ok) throw new Error("Error al verificar");
      await fetchPendingWriteups();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Cargando writeups pendientes...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "24px auto", fontFamily: "'Fira Mono', monospace", color: "#44FF44" }}>
      <h1>Revisión de Writeups Pendientes</h1>
      {error && <p style={{ color: "#f33" }}>{error}</p>}
      {writeups.length === 0 && <p>No hay writeups pendientes.</p>}
      {writeups.map(w => (
        <section key={w.id} style={{ background: "#23272F", padding: 20, marginBottom: 16, borderLeft: "6px solid #44FF44", borderRadius: 6 }}>
          <p><b>Usuario:</b> {w.usuario}</p>
          <p><b>Laboratorio:</b> {w.lab_title}</p>
          <p><b>Evidencia:</b> {w.evidence}</p>
          <p><b>Fecha de envío:</b> {new Date(w.submitted_at).toLocaleString()}</p>
          <button style={{ marginRight: 12, cursor: "pointer", backgroundColor: "#24D05A", border: "none", padding: "6px 16px", borderRadius: 4, fontWeight: "bold" }}
            onClick={() => handleVerify(w.id, true)}>Aprobar</button>
          <button style={{ cursor: "pointer", backgroundColor: "#F44336", border: "none", padding: "6px 16px", borderRadius: 4, fontWeight: "bold" }}
            onClick={() => handleVerify(w.id, false)}>Rechazar</button>
        </section>
      ))}
    </div>
  );
}
