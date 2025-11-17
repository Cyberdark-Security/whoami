import React, { useEffect, useState } from "react";

// MODAL PARA SUBIR WRITEUP
function ModalUpload({ open, onClose, onSubmit, lab, user }) {
  const [writeupUrl, setWriteupUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (open) {
      setWriteupUrl("");
      setMensaje("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleSend = async e => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!writeupUrl.match(/^https?:\/\/.+/)) {
      setError("❌ Ingresa una URL válida (https://...)");
      return;
    }

    setLoading(true);

    try {
      const userStr = localStorage.getItem("user");
      const userObj = userStr ? JSON.parse(userStr) : null;

      if (!userObj || !userObj.id) {
        setError("❌ Error: Usuario no logueado");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/admin/submit-writeup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userObj.id,
          lab_id: lab.id,
          evidence: writeupUrl
        })
      });

      const data = await res.json();

      if (res.ok) {
        setWriteupUrl("");
        setMensaje("✅ ¡Writeup enviado correctamente!");
        setTimeout(() => {
          setMensaje("");
          onClose();
          if (onSubmit) {
            onSubmit({ labId: lab.id, writeup_url: writeupUrl });
          }
        }, 1200);
      } else {
        setError(`❌ ${data.error || "Error enviando writeup"}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("❌ Error de conexión al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000b", display: "flex",
      alignItems: "center", justifyContent: "center", zIndex: 2000
    }}>
      <form onSubmit={handleSend} style={{
        background: "#191b24", border: "2.5px solid #39ff14", borderRadius: 14,
        padding: "2em 2.5em", minWidth: 320
      }}>
        <div style={{ color: "#39ff14", fontWeight: "bold", marginBottom: 8 }}>
          Publicar writeup para: <span style={{ color: "#fff" }}>{lab.title}</span>
        </div>

        <label style={{ color: "#fff", display: "block", marginBottom: 10, fontSize: 12 }}>
          👤 Usuario: <strong>{user ? (user.username || user.nombre) : "Desconocido"}</strong>
        </label>

        <label style={{ color: "#fff", display: "block", marginBottom: 10 }}>
          Link al writeup (Notion, GDrive, Blog, etc):
          <input
            type="url"
            value={writeupUrl}
            required
            placeholder="https://..."
            onChange={e => setWriteupUrl(e.target.value)}
            style={{
              display: "block", width: "100%", marginTop: 4, padding: "5px",
              borderRadius: 5, border: error ? "2px solid #ff0000" : "1px solid #222",
              background: "#252A32", color: "#e0e0e0"
            }}
          />
        </label>

        {error && (
          <div style={{
            marginBottom: 10, padding: 8, borderRadius: 4,
            background: "rgba(255,0,0,0.1)", border: "1px solid #ff0000",
            color: "#ff6666", fontSize: 12
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "1em", marginTop: 14 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              background: "#111a", color: "#fff", borderRadius: 5, border: "none",
              padding: "7px 14px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1
            }}>
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !writeupUrl.trim()}
            style={{
              background: "#39ff14", color: "#111", border: "none", fontWeight: "bold",
              borderRadius: 6, padding: "8px 18px", cursor: loading || !writeupUrl.trim() ? "not-allowed" : "pointer",
              opacity: loading || !writeupUrl.trim() ? 0.6 : 1
            }}>
            {loading ? "⏳ Enviando..." : "✅ Enviar"}
          </button>
        </div>

        {mensaje && <div style={{ color: "#39ff14", marginTop: 12, fontSize: 13 }}>{mensaje}</div>}
      </form>
    </div>
  );
}

// Función para obtener color por dificultad
const getDifficultyStyle = (difficulty) => {
  const styles = {
    'fácil': { background: '#4CAF50', color: '#fff' },
    'medio': { background: '#FF9800', color: '#fff' },
    'difícil': { background: '#F44336', color: '#fff' },
    'insano': { background: '#9C27B0', color: '#fff' }
  };
  return styles[difficulty?.toLowerCase()] || { background: '#999', color: '#fff' };
};

export default function Labs({ user }) {
  const esAdmin = user && user.role === "admin";
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, lab: null });

  const [nuevoLab, setNuevoLab] = useState({
    title: "",
    download_link: "",
    published_date: "",
    difficulty: "fácil"
  });

  const recargarLaboratorios = () => {
    setLoading(true);
    fetch("/api/labs")
      .then(res => res.json())
      .then(data => {
        setLabs(data.labs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando labs:", err);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    recargarLaboratorios();
  }, []);

  const handleNuevoLabChange = e => {
    setNuevoLab({ ...nuevoLab, [e.target.name]: e.target.value });
  };

  const handleNuevoLabSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/add-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: nuevoLab.title,
          published_date: nuevoLab.published_date,
          download_link: nuevoLab.download_link,
          difficulty: nuevoLab.difficulty
        })
      });
      
      if (res.ok) {
        setNuevoLab({ title: "", download_link: "", published_date: "", difficulty: "fácil" });
        recargarLaboratorios();
        alert("✅ Laboratorio agregado exitosamente");
      } else {
        const error = await res.json();
        alert(`❌ Error: ${error.error}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Error al agregar laboratorio");
    }
  };

  const enviarEvidencia = async ({ labId, writeup_url }) => {
    console.log(`✅ Writeup enviado para lab ${labId}`);
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
            style={{ margin: "6px 0", width: "94%", padding: 8, background: "#252A32", border: "1px solid #39ff14", borderRadius: 4, color: "#fff" }}
            name="title"
            placeholder="Título o nombre"
            value={nuevoLab.title}
            onChange={handleNuevoLabChange}
            required
          />
          
          <input
            style={{ margin: "6px 0", width: "94%", padding: 8, background: "#252A32", border: "1px solid #39ff14", borderRadius: 4, color: "#fff" }}
            name="published_date"
            placeholder="Fecha de publicación"
            type="date"
            value={nuevoLab.published_date}
            onChange={handleNuevoLabChange}
            required
          />
          
          <input
            style={{ margin: "6px 0", width: "94%", padding: 8, background: "#252A32", border: "1px solid #39ff14", borderRadius: 4, color: "#fff" }}
            name="download_link"
            placeholder="Link de descarga .zip/.rar/.ova"
            value={nuevoLab.download_link}
            onChange={handleNuevoLabChange}
            required
          />

          <select
            style={{ margin: "6px 0", width: "94%", padding: 8, background: "#252A32", border: "1px solid #39ff14", borderRadius: 4, color: "#fff" }}
            name="difficulty"
            value={nuevoLab.difficulty}
            onChange={handleNuevoLabChange}
            required
          >
            <option value="fácil">🟢 Fácil</option>
            <option value="medio">🟠 Medio</option>
            <option value="difícil">🔴 Difícil</option>
            <option value="insano">🟣 Insano</option>
          </select>

          <button
            style={{
              backgroundColor: "#39ff14",
              border: "none",
              padding: "10px 26px",
              borderRadius: 4,
              fontWeight: 700,
              marginTop: 6,
              fontFamily: "monospace",
              cursor: "pointer"
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{
                color: "#71e35b",
                fontSize: "2em",
                fontWeight: 800,
                letterSpacing: "1px"
              }}>
                {`Lab ${idx + 1}: ${l.title}`}
              </div>
              {/* BADGE DE DIFICULTAD */}
              {l.difficulty && (
                <div style={{
                  ...getDifficultyStyle(l.difficulty),
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  fontSize: "0.9em",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  {l.difficulty}
                </div>
              )}
            </div>

            <div style={{
              fontWeight: "bold",
              color: "#b8ffcb",
              fontSize: "1.05em",
              marginBottom: "12px"
            }}>
              Publicado: {l.created_at ? new Date(l.created_at).toLocaleDateString() : "N/A"}
            </div>

            <div style={{ display: "flex", gap: "16px" }}>
              <a
                href={l.download_link}
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
        user={user}
        onClose={() => setModal({ open: false, lab: null })}
        onSubmit={enviarEvidencia}
      />
    </main>
  );
}
