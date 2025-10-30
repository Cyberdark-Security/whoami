import React, { useEffect, useState } from "react";

// MODAL PARA SUBIR EVIDENCIA, igual que antes
function ModalUpload({ open, onClose, onSubmit, lab }) {
  const [writeupUrl, setWriteupUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  React.useEffect(() => {
    if (open) {
      setWriteupUrl("");
      setMensaje("");
    }
  }, [open]);

  if (!open) return null;

  const handleSend = async e => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    await onSubmit({ labId: lab.id, writeup_url: writeupUrl });
    setLoading(false);
    setMensaje("¡Enviado correctamente!");
    setTimeout(() => { setMensaje(""); onClose(); }, 1200);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000}}>
      <form onSubmit={handleSend} style={{
        background: "#191b24", border: "2.5px solid #39ff14", borderRadius: 14, padding: "2em 2.5em", minWidth: 320
      }}>
        <div style={{ color: "#39ff14", fontWeight: "bold", marginBottom: 8 }}>
          Publicar writeup para: <span style={{ color: "#fff" }}>{lab.title}</span>
        </div>
        <label style={{color:"#fff",display:"block",marginBottom:10}}>
          Link al writeup (Notion, GDrive, Blog, etc):
          <input
            type="url"
            value={writeupUrl}
            required
            placeholder="https://..."
            onChange={e => setWriteupUrl(e.target.value)}
            style={{
              display: "block", width: "100%", marginTop: 4,padding:"5px",borderRadius:5,border:"1px solid #222"
            }}
          />
        </label>
        <div style={{ display: "flex", gap: "1em", marginTop: 14 }}>
          <button type="button" onClick={onClose} style={{
            background: "#111a", color: "#fff", borderRadius:5, border:"none", padding:"7px 14px"
          }}>Cancelar</button>
          <button type="submit" disabled={loading} style={{
            background: "#39ff14", color: "#111", border: "none", fontWeight: "bold", borderRadius: 6, padding: "8px 18px"
          }}>{loading ? "Enviando..." : "Enviar"}</button>
        </div>
        {mensaje && <div style={{ color: "#39ff14", marginTop: 12 }}>{mensaje}</div>}
      </form>
    </div>
  );
}

export default function Labs({ user }) {
  const esAdmin = user && user.role === "admin";
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, lab: null });

  // NUEVO: Estado para formulario admin
  const [nuevoLab, setNuevoLab] = useState({
    title: "",
    megalink: "",
    fecha: ""
  });

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

  React.useEffect(() => {
    recargarLaboratorios();
  }, []);

  // NUEVO: Manejadores del form admin
  const handleNuevoLabChange = e => {
    setNuevoLab({ ...nuevoLab, [e.target.name]: e.target.value });
  };

  const handleNuevoLabSubmit = async e => {
    e.preventDefault();
    await fetch("/api/labs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: nuevoLab.title,
        megalink: nuevoLab.megalink,
        fecha: nuevoLab.fecha
      })
    });
    setNuevoLab({ title: "", megalink: "", fecha: "" });
    recargarLaboratorios();
  };

  const enviarEvidencia = async ({ labId, writeup_url }) => {
    await fetch("/api/evidencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ labId, writeup_url })
    });
    recargarLaboratorios();
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

      {/* FORMULARIO SOLO ADMIN */}
      {esAdmin && (
        <form onSubmit={handleNuevoLabSubmit} style={{
          background: "#191a1f",
          border: "2px solid #39ff14",
          borderRadius: 12,
          marginBottom: 30,
          padding: 30,
          display: "flex",
          flexDirection: "column"
        }}>
          <h2 style={{ color: "#39ff14" }}>Agregar laboratorio nuevo</h2>
          <input
            style={{margin:"6px 0", width:"94%", padding:8}}
            name="title"
            placeholder="Título o nombre"
            value={nuevoLab.title}
            onChange={handleNuevoLabChange}
            required
          />
          <input
            style={{margin:"6px 0", width:"94%", padding:8}}
            name="fecha"
            placeholder="Fecha (YYYY-MM-DD)"
            type="date"
            value={nuevoLab.fecha}
            onChange={handleNuevoLabChange}
            required
          />
          <input
            style={{margin:"6px 0", width:"94%", padding:8}}
            name="megalink"
            placeholder="Link de descarga .zip/.rar/.ova"
            value={nuevoLab.megalink}
            onChange={handleNuevoLabChange}
            required
          />
          <button
            style={{
              backgroundColor: "#39ff14",
              border: "none",
              padding: "10px 26px",
              borderRadius: 4,
              fontWeight: 700,
              marginTop: 6,
              fontFamily: "monospace"
            }}
            type="submit"
          >
            Subir laboratorio
          </button>
        </form>
      )}

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
              Publicado: {l.created_at ? new Date(l.created_at).toLocaleDateString() : l.fecha}
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
