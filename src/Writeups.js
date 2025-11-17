import React, { useEffect, useState } from "react";

export default function Writeups() {
  const [writeups, setWriteups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setError("❌ No estás autenticado. Por favor inicia sesión.");
      setLoading(false);
      return;
    }

    console.log("📡 Fetching writeups with token:", token.substring(0, 20) + "...");

    fetch("/api/admin/writeups-pending", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`  // ← TOKEN AQUÍ
      }
    })
      .then(res => {
        console.log("Response status:", res.status);
        if (res.status === 401) {
          throw new Error("Token inválido o expirado");
        }
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("✅ Writeups recibidos:", data);
        setWriteups(data.data || []);
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
      <h2 style={{ color: "#39ff14" }}>Revisión de Writeups Pendientes</h2>

      {writeups.length === 0 ? (
        <div style={{ color: "#9aebc8", textAlign: "center", padding: "2em" }}>
          ✓ No hay writeups pendientes
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
              <th style={{ padding: "1em", textAlign: "left" }}>Email</th>
              <th style={{ padding: "1em", textAlign: "left" }}>Enviado</th>
              <th style={{ padding: "1em", textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {writeups.map(w => (
              <tr key={w.id} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: "1em" }}>{w.lab_title}</td>
                <td style={{ padding: "1em" }}>{w.nombre} {w.apellido}</td>
                <td style={{ padding: "1em" }}>{w.email}</td>
                <td style={{ padding: "1em" }}>
                  {new Date(w.submitted_at).toLocaleString()}
                </td>
                <td style={{ padding: "1em", textAlign: "center" }}>
                  <button
                    onClick={() => window.open(w.evidence, "_blank")}
                    style={{
                      background: "#39ff14",
                      color: "#000",
                      border: "none",
                      padding: "0.5em 1em",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginRight: "0.5em",
                      fontWeight: "bold"
                    }}
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => aprobar(w.id, true)}
                    style={{
                      background: "#00ff00",
                      color: "#000",
                      border: "none",
                      padding: "0.5em 1em",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginRight: "0.5em",
                      fontWeight: "bold"
                    }}
                  >
                    ✓ Aprobar
                  </button>
                  <button
                    onClick={() => aprobar(w.id, false)}
                    style={{
                      background: "#ff3333",
                      color: "#fff",
                      border: "none",
                      padding: "0.5em 1em",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    ✗ Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );

  // Función para aprobar/rechazar
  function aprobar(writeupId, aprobado) {
    const token = localStorage.getItem("token");
    
    fetch("/api/admin/approve-writeup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`  // ← TOKEN AQUÍ TAMBIÉN
      },
      body: JSON.stringify({ writeupId, aprobar: aprobado })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Recargar list
          setWriteups(writeups.filter(w => w.id !== writeupId));
          alert(data.message || "✓ Escrito procesado");
        } else {
          alert("❌ Error: " + data.error);
        }
      })
      .catch(err => alert("❌ Error: " + err.message));
  }
}
