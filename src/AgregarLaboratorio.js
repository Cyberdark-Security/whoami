import React, { useState } from "react";

export default function AgregarLaboratorio({ onLabAdded }) {
  const [title, setTitle] = useState("");
  const [fecha, setFecha] = useState("");
  const [megalink, setMegaLink] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje("");
    setError("");
    try {
      const res = await fetch("/api/labs", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          created_at: fecha,
          megalink // minúscula: igual al campo DB y backend
        })
      });
      if (!res.ok) throw new Error("Error agregando laboratorio");
      setMensaje("Laboratorio agregado correctamente.");
      setTitle(""); setFecha(""); setMegaLink("");
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
      <h3 style={{ color: "#39ff14" }}>Agregar laboratorio</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre máquina:
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginBottom: 10 }}
          />
        </label>
        <label>Fecha publicación:
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginBottom: 10 }}
          />
        </label>
        <label>Link de descarga:
          <input
            type="url"
            value={megalink}
            onChange={e => setMegaLink(e.target.value)}
            required
            style={{ display: 'block', width: '100%', marginBottom: 10 }}
          />
        </label>
        <button type="submit" style={{
          background: "#39ff14",
          color: "#222",
          border: "none",
          padding: "8px 18px",
          fontWeight: 700,
          borderRadius: 5,
          marginTop: 8
        }}>Agregar</button>
      </form>
      {mensaje && <div style={{ color: "#3fa", marginTop: '7px' }}>{mensaje}</div>}
      {error && <div style={{ color: "#f55", marginTop: '7px' }}>{error}</div>}
    </section>
  );
}