import React, { useState } from "react";
export default function ModalLogin({ onLogin, onCancel }) {
  const [username, setUsername] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) return;
    // Aquí deberías validar contra backend realmente
    onLogin({ username });
  };
  return (
    <form onSubmit={handleSubmit} style={{textAlign:"center"}}>
      <h2 style={{ color: "#0CE0FF" }}>Iniciar sesión</h2>
      <input
        type="text"
        placeholder="Nombre o usuario"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        style={{width:"90%",marginBottom:14,padding:8,fontSize:15,borderRadius:4,border:"2px solid #24D05A",background:"#252A32",color:"#e0e0e0"}}
      />
      <button type="submit" style={{
        padding:"8px 20px", background:"#44FF44",color:"#181A20",fontWeight:700,borderRadius:4,border:"none",marginRight:10
      }}>Entrar</button>
      <button type="button" onClick={onCancel} style={{
        padding:"8px 20px", background:'#23272F', color:'#0CE0FF', fontWeight:700, borderRadius:4, border:"1.5px solid #0CE0FF"
      }}>Cancelar</button>
    </form>
  );
}
