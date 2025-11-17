import React, { useRef, useState } from "react";

export default function ModalUpload({ open, onClose, onSubmit, lab }) {
  const fileRef = useRef();
  const [writeupUrl, setWriteupUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  if (!open) return null;

  const handleSend = async e => {
    e.preventDefault();
    setError("");
    setMensaje("");

    // ✅ VALIDAR URL
    if (!writeupUrl.trim()) {
      setError("❌ Ingresa una URL para el writeup");
      return;
    }

    if (!writeupUrl.match(/^https?:\/\/.+/)) {
      setError("❌ La URL debe empezar con http:// o https://");
      return;
    }

    setLoading(true);

    try {
      // ✅ OBTENER USER_ID DEL LOCALSTORAGE
      const userStr = localStorage.getItem("user");
      const userObj = userStr ? JSON.parse(userStr) : null;

      if (!userObj || !userObj.id) {
        setError("❌ Error: Usuario no logueado");
        setLoading(false);
        return;
      }

      // ✅ HACER POST AL BACKEND
      const res = await fetch("/api/submit-writeup", {
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
      position: "fixed",
      inset: 0,
      background: "#000b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000
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
          Enviar evidencia para:<br /><span style={{ color: "#fff" }}>{lab.title}</span>
        </div>

        <label style={{ color: "#fff" }}>
          URL del Writeup (GDrive, Notion, Blog, etc):
          <input
            type="url"
            style={{
              display: "block",
              width: "100%",
              borderRadius: 5,
              minHeight: 40,
              marginTop: 4,
              padding: "8px 12px",
              border: "1px solid #39ff14",
              background: "#0a0c1a",
              color: "#39ff14"
            }}
            value={writeupUrl}
            onChange={e => setWriteupUrl(e.target.value)}
            required
            placeholder="https://... (GDrive, Notion, GitHub, etc)"
          />
        </label>

        <div style={{ display: "flex", gap: "1em", marginTop: 8 }}>
          <button type="button" onClick={onClose} style={{
            background: "#111a",
            color: "#fff",
            borderRadius: 5,
            border: "none",
            padding: "7px 14px",
            cursor: "pointer"
          }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading} style={{
            background: "#39ff14",
            color: "#111",
            border: "none",
            fontWeight: "bold",
            borderRadius: 6,
            padding: "8px 18px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1
          }}>
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>

        {error && <div style={{ color: "#ff6b6b" }}>{error}</div>}
        {mensaje && <div style={{ color: "#39ff14" }}>{mensaje}</div>}
      </form>
    </div>
  );
}
