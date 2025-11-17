import React, { useState } from "react";

export default function ModalEnviarEvidencia({ lab, user, onSend, onCancel }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!url.match(/^https?:\/\/.+/)) {
      setError("❌ Ingresa una URL válida (https://...)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Obtener user_id del localStorage
      const userStr = localStorage.getItem("user");
      const userObj = userStr ? JSON.parse(userStr) : null;

      if (!userObj || !userObj.id) {
        setError("❌ Error: Usuario no logueado");
        setLoading(false);
        return;
      }

      // Enviar al backend
      const res = await fetch("/api/admin/submit-writeup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userObj.id,
          lab_id: lab.id,
          evidence: url
        })
      });

      const data = await res.json();

      if (res.ok) {
        setUrl("");
        if (onSend) {
          onSend(lab.id, user.username || user.nombre, url);
        }
        setTimeout(() => {
          onCancel();
        }, 500);
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
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#23272F", padding: 24, borderRadius: 12, minWidth: 340, 
        boxShadow: "0 8px 30px #44FF4499", color: "#e0e0e0"
      }}>
        <h2 style={{ color: "#24D05A", marginTop: 0 }}>
          ✅ Enviar evidencia para: <span style={{ color: "#0CE0FF" }}>{lab.title}</span>
        </h2>

        {/* Campo Usuario (deshabilitado) */}
        <label style={{ color: "#44FF44", display: "block", marginBottom: 8 }}>
          👤 Nombre de usuario
        </label>
        <input
          type="text"
          value={user ? (user.username || user.nombre) : ""}
          disabled
          style={{
            width: "100%", marginBottom: 16, padding: 8, fontSize: 15, borderRadius: 4,
            border: "2px solid #24D05A", background: "#252A32", color: "#e0e0e0"
          }}
        />

        {/* Campo URL */}
        <label style={{ color: "#0CE0FF", display: "block", marginBottom: 8 }}>
          🔗 URL de la evidencia / writeup
        </label>
        <input
          type="url"
          value={url}
          onChange={e => {
            setUrl(e.target.value);
            setError("");
          }}
          placeholder="https://notion.so/... o https://github.com/..."
          style={{
            width: "100%", marginBottom: 14, padding: 8, fontSize: 15, borderRadius: 4,
            border: error ? "2px solid #ff0000" : "2px solid #0CE0FF", 
            background: "#252A32", color: "#e0e0e0"
          }}
          required
        />

        {/* Mensaje de error */}
        {error && (
          <div style={{
            marginBottom: 12, padding: 10, borderRadius: 4,
            background: "rgba(255,0,0,0.1)", border: "1px solid #ff0000",
            color: "#ff6666", fontSize: 12
          }}>
            {error}
          </div>
        )}

        {/* Info */}
        <div style={{
          marginBottom: 12, padding: 10, borderRadius: 4,
          background: "rgba(0,206,255,0.1)", border: "1px solid #0CE0FF",
          fontSize: 12, color: "#0CE0FF"
        }}>
          💡 Puedes compartir desde:<br/>
          • Notion | Google Drive | GitHub<br/>
          • Medium | Blog personal | Gist
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            style={{
              padding: "8px 20px", background: "#0CE0FF", color: "#181A20",
              fontWeight: 700, borderRadius: 4, border: "none", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading || !url.trim() ? 0.6 : 1
            }}
          >
            {loading ? "⏳ Enviando..." : "✅ Enviar"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: "8px 20px", background: "#23272F", color: "#0CE0FF",
              fontWeight: 700, borderRadius: 4, border: "1.5px solid #0CE0FF",
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
