import React, { useState } from "react";

export default function AgregarLaboratorio({ onLabAdded }) {
  const [title, setTitle] = useState("");
  const [fecha, setFecha] = useState("");
  const [megalink, setMegaLink] = useState("");
  const [difficulty, setDifficulty] = useState("medio"); // ✅ NUEVO: Estado para dificultad
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje("");
    setError("");
    try {
      const res = await fetch("/api/admin/add-lab", { // ✅ CAMBIO: Nuevo endpoint
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          published_date: fecha, // ✅ CAMBIO: Nombre correcto para BD
          download_link: megalink, // ✅ CAMBIO: Nombre correcto para BD
          difficulty // ✅ NUEVO: Enviar dificultad
        })
      });
      if (!res.ok) throw new Error("Error agregando laboratorio");
      setMensaje("✅ Laboratorio agregado correctamente.");
      setTitle("");
      setFecha("");
      setMegaLink("");
      setDifficulty("medio"); // ✅ NUEVO: Resetear a valor por defecto
      if (onLabAdded) onLabAdded();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section style={{
      margin: "38px auto",
      maxWidth: 420,
      background: "#222C",
      border: "1.5px solid #39ff14",
      borderRadius: "8px",
      padding: "1.5em 2em"
    }}>
      <h3 style={{ color: "#39ff14" }}>Agregar laboratorio nuevo</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre máquina:
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ 
              display: 'block', 
              width: '100%', 
              marginBottom: 10,
              padding: '8px',
              background: '#1a1a1a',
              border: '1px solid #39ff14',
              color: '#39ff14',
              borderRadius: '4px'
            }}
          />
        </label>

        <label>Fecha publicación:
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            required
            style={{ 
              display: 'block', 
              width: '100%', 
              marginBottom: 10,
              padding: '8px',
              background: '#1a1a1a',
              border: '1px solid #39ff14',
              color: '#39ff14',
              borderRadius: '4px'
            }}
          />
        </label>

        <label>Link de descarga:
          <input
            type="url"
            value={megalink}
            onChange={e => setMegaLink(e.target.value)}
            required
            style={{ 
              display: 'block', 
              width: '100%', 
              marginBottom: 10,
              padding: '8px',
              background: '#1a1a1a',
              border: '1px solid #39ff14',
              color: '#39ff14',
              borderRadius: '4px'
            }}
          />
        </label>

        {/* ✅ NUEVO: SELECT para dificultad */}
        <label>Nivel de dificultad:
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            required
            style={{
              display: 'block',
              width: '100%',
              marginBottom: 10,
              padding: '8px',
              background: '#1a1a1a',
              border: '1px solid #39ff14',
              color: '#39ff14',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <option value="fácil">🟢 Fácil (1 punto)</option>
            <option value="medio">🟡 Medio (2 puntos)</option>
            <option value="difícil">🔴 Difícil (5 puntos)</option>
            <option value="insano">⚫ Insano (8 puntos)</option>
          </select>
        </label>

        <button type="submit" style={{
          background: "#39ff14",
          color: "#222",
          border: "none",
          padding: "8px 18px",
          fontWeight: 700,
          borderRadius: 5,
          marginTop: 8,
          cursor: 'pointer',
          width: '100%'
        }}>
          ✅ Agregar laboratorio
        </button>
      </form>
      
      {mensaje && (
        <div style={{ 
          color: "#3fa", 
          marginTop: '12px',
          padding: '10px',
          background: 'rgba(63, 255, 170, 0.1)',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          {mensaje}
        </div>
      )}
      
      {error && (
        <div style={{ 
          color: "#ff5555", 
          marginTop: '12px',
          padding: '10px',
          background: 'rgba(255, 85, 85, 0.1)',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          ❌ {error}
        </div>
      )}
    </section>
  );
}
