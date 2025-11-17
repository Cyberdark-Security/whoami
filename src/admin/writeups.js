require('dotenv').config();

import React, { useEffect, useState } from "react";

export default function AdminWriteups() {
  const [writeups, setWriteups] = useState([]);

  useEffect(() => {
    fetch("/api/writeups")
      .then(r => r.json())
      .then(data => setWriteups(data.writeups || []));
  }, []);

  const decidir = (id, aprobado) => {
    fetch("/api/writeups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ writeupId: id, aprobar }),
    }).then(() => setWriteups(writeups.filter(w => w.id !== id)));
  };

  return (
    <section style={{ margin: "2em auto", maxWidth: 600 }}>
      <h2 style={{ color: "#39ff14" }}>Writeups pendientes</h2>
      {writeups.length === 0 && <p style={{ color: "#fbd" }}>No hay writeups pendientes.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {writeups.map(w => (
          <li key={w.id} style={{ background: "#191b24", borderRadius: 7, margin: "18px 0", padding: "16px 18px" }}>
            <b>{w.title || "Lab #" + w.lab_id}</b> por <span style={{ color: "#39ff14" }}>{w.nombre}</span><br />
            <small style={{ fontSize: "0.9em", color: "#88ffcc" }}>
              Enviado: {new Date(w.fecha_envio).toLocaleString()}
            </small>
            <div style={{ marginTop: 7, marginBottom: 8 }}>
              <a href={w.writeup_url} target="_blank" rel="noopener noreferrer" style={{ color: "#39ff14" }}>
                Ver writeup publicado
              </a>
            </div>
            <button style={{ marginRight: 10, padding: "6px 14px" }} onClick={() => decidir(w.id, true)}>Aprobar</button>
            <button style={{ color: "#f55", padding: "6px 14px" }} onClick={() => decidir(w.id, false)}>Rechazar</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
