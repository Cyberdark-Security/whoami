import React, { useState } from "react";

export default function ModalRegistro({ onRegister, onCancel }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!username.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    onRegister({ username: username.trim() });
  };

  return (
    <div style={styles.overlay}>
      <form onSubmit={handleSubmit} style={styles.modal}>
        <h2 style={{ color: "#24D05A" }}>Registro rápido</h2>
        <p style={{color:"#e0e0e0",marginBottom:6}}>Para descargar o enviar evidencia, ingresa tu nombre:</p>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Nombre"
          style={styles.input}
          required
        />
        {error && <div style={{ color: "#f44", marginBottom: 8 }}>{error}</div>}
        <div style={{display: "flex", gap:10}}>
          <button type="submit" style={styles.button}>Entrar</button>
          <button type="button" onClick={onCancel} style={styles.cancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  overlay: {position:"fixed", left:0,top:0,width:"100vw",height:"100vh",background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1100},
  modal: {background:"#23272F",padding:24,borderRadius:12,minWidth:320,boxShadow:"0 8px 22px #44FF4422",color:"#e0e0e0"},
  input: {width:"100%",marginBottom:14,padding:8,fontSize:15,borderRadius:4,border:"2px solid #0CE0FF",background:"#252A32",color:"#e0e0e0"},
  button: {padding:"8px 20px", background:"#44FF44",color:"#181A20",fontWeight:700,borderRadius:4,border:"none",cursor:"pointer"},
  cancel: {padding:"8px 20px", background:'#23272F', color:'#0CE0FF', fontWeight:700, borderRadius:4, border:"1.5px solid #0CE0FF",cursor:"pointer"}
};
