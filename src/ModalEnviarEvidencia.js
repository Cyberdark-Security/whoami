import React, { useState } from "react";
export default function ModalEnviarEvidencia({ lab, user, onSend, onCancel }) {
  const [url, setUrl] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    if (!url.match(/^https?:\/\/.+/)) {
      alert("Ingresa una URL válida.");
      return;
    }
    onSend(lab.id, user.username, url);
  };
  return (
    <div style={{
      position:"fixed",left:0,top:0,width:"100vw",height:"100vh",
      background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000
    }}>
      <form onSubmit={handleSubmit} style={{
        background:"#23272F",padding:24,borderRadius:12,minWidth:340,boxShadow:"0 8px 30px #44FF4499",color:"#e0e0e0"
      }}>
        <h2 style={{ color: "#24D05A" }}>Enviar evidencia para: {lab.title}</h2>
        <label style={{ color: "#44FF44" }}>Nombre</label>
        <input
          type="text"
          value={user ? user.username : ""}
          disabled
          style={{width:"100%",marginBottom:12,padding:8,fontSize:15,borderRadius:4,border:"2px solid #24D05A",background:"#252A32",color:"#e0e0e0"}}
        />
        <label style={{ color: "#0CE0FF" }}>URL de la evidencia</label>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://..."
          style={{width:"100%",marginBottom:14,padding:8,fontSize:15,borderRadius:4,border:"2px solid #0CE0FF",background:"#252A32",color:"#e0e0e0"}}
          required
        />
        <div style={{display: "flex", gap:10}}>
          <button type="submit" style={{
            padding:"8px 20px", background:"#0CE0FF",color:"#181A20",fontWeight:700,borderRadius:4,border:"none",marginRight:10
          }}>Enviar</button>
          <button type="button" onClick={onCancel} style={{
            padding:"8px 20px", background:'#23272F', color:'#0CE0FF', fontWeight:700, borderRadius:4, border:"1.5px solid #0CE0FF"
          }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
