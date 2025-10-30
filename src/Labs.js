import React, { useEffect, useState, useRef } from "react";

// ModalUpload: formulario popup para enviar evidencia
function ModalUpload({ open, onClose, onSubmit, lab }) {
  const fileRef = useRef();
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (open) {
      setTexto("");
      setMensaje("");
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [open]);

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
    await onSubmit(formData);
    setLoading(false);
    setMensaje("¡Enviado correctamente!");
    setTimeout(() => { setMensaje(""); onClose(); }, 1200);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000c", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000
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

export default function Labs({ user }) {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, lab: null });

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

  // Simula POST, reemplaza por tu fetch real
  const enviarEvidencia = async formData => {
    // Ejemplo de request real:
    // await fetch("/api/evidencias", { method: "POST", body: formData })
    await new Promise(r => setTimeout(r, 600)); // demo
  };

  if (loading) return <div style={{ color: "#39ff14" }}>Cargando laboratorios...</div>;

  return (
    <main style={{
      maxWidth: 950,
      margin: "2em auto",
      background: "#18191b",
      border: "1.5px solid #39ff14",
      borderRadius: "14px",
      padding: "2.4em",
      boxSizing: "border-box"
    }}>
      <h1 style={{
        color: "#39ff14",
        fontFamily: "monospace",
        fontWeight: 900,
        fontSize: "2.4em",
        margin: "0 0 28px 0",
        letterSpacing: "2px"
      }}>
        Laboratorios Dockerizados de Pentesting
      </h1>

      {labs.length === 0 && <p style={{ color: "#fbd" }}>No hay laboratorios publicados.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {labs.map((l, idx) => (
          <section
            key={l.id}
            style={{
              background: "#21242a",
              padding: "28px 32px 22px 32px",
              borderRadius: "18px",
              border: "3.5px solid #39ff14",
              marginBottom: 0,
              fontFamily: "monospace"
            }}>
            <div style={{
              color: "#71e35b",
              fontSize: "2em",
              fontWeight: 800,
              marginBottom: "8px",
              letterSpacing: "1px"
            }}>
              {`Lab ${idx + 1}: ${l.title}`}
            </div>
            <div style={{
              fontWeight: "bold",
              color: "#b8ffcb",
              fontSize: "1.05em",
              marginBottom: "12px"
            }}>
              Publicado: {new Date(l.created_at).toLocaleDateString()}
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <a
                href={l.megalink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#39ff14",
                  color: "#15191b",
                  fontWeight: 900,
                  border: "none",
                  borderRadius: "7px",
                  padding: "6px 19px",
                  fontFamily: "monospace",
                  textDecoration: "underline",
                  fontSize: "1.1em",
                  marginRight: 4,
                  letterSpacing: ".5px"
                }}>
                Descargar
              </a>
              {user && (
                <button
                  onClick={() => setModal({ open: true, lab: l })}
                  style={{
                    background: "#71ff84",
                    color: "#21242a",
                    fontWeight: 900,
                    border: "none",
                    borderRadius: "7px",
                    padding: "6px 20px",
                    fontFamily: "monospace",
                    fontSize: "1em",
                    cursor: "pointer",
                    boxShadow: "0 1px 7px #101c",
                  }}>
                  Enviar evidencia
                </button>
              )}
            </div>
          </section>
        ))}
      </div>
      <ModalUpload
        open={modal.open}
        lab={modal.lab || {}}
        onClose={() => setModal({ open: false, lab: null })}
        onSubmit={enviarEvidencia}
      />
    </main>
  );
}
