import React, { useRef, useState } from "react";

export default function ModalUpload({ open, onClose, onSubmit, lab }) {
  const fileRef = useRef();
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  if (!open) return null;

  const handleSend = async e => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    const formData = new FormData();
    formData.append("labId", lab.id);
    formData.append("texto", texto);
    if (fileRef.current.files[0]) {
      formData.append("archivo", fileRef.current.files[0]);
    }
    // Simula submit, reemplaza con tu lógica de POST
    await onSubmit(formData);
    setLoading(false);
    setTexto("");
    if (fileRef.current) fileRef.current.value = "";
    setMensaje("¡Enviado correctamente!");
    setTimeout(() => { setMensaje(""); onClose(); }, 1200);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000b", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000
    }}>
      <form onSubmit={handleSend} style={{
        background: "#191b24",
        border: "2.5px solid #39ff14",
        borderRadius: 14,
        padding: "2em 2.5em",
        boxShadow: "0 8px 30px #0306",
        minWidth: 320,
        minHeight: 130,
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}>
        <div style={{ color: "#39ff14", fontWeight: "bold", fontSize: "1.15em", marginBottom: 2 }}>
          Enviar evidencia para:<br/><span style={{color:"#fff"}}>{lab.title}</span>
        </div>
        <label style={{color: "#fff"}}>Writeup / Evidencia:
          <textarea style={{ display: "block", width: "100%", borderRadius: 5, minHeight:60, marginTop:4 }}
            value={texto} onChange={e=>setTexto(e.target.value)} required placeholder="Describe solución, pasos, flags, etc..."
          />
        </label>
        <label style={{color: "#fff"}}>Archivo adjunto (opcional):
          <input type="file" ref={fileRef} style={{ marginTop: 2 }} />
        </label>
        <div style={{ display:"flex", gap:"1em", marginTop:8 }}>
          <button type="button" onClick={onClose} style={{
            background: "#111a", color: "#fff", borderRadius:5, border:"none", padding:"7px 14px"
          }}>Cancelar</button>
          <button type="submit" disabled={loading} style={{
            background: "#39ff14", color:"#111", border:"none", fontWeight:"bold", borderRadius:6, padding:"8px 18px"
          }}>{loading ? "Enviando..." : "Enviar"}</button>
        </div>
        {mensaje && <div style={{ color: "#39ff14" }}>{mensaje}</div>}
      </form>
    </div>
  );
}
