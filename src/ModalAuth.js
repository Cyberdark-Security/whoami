import React from "react";
import ModalLogin from "./ModalLogin";
import ModalRegistro from "./ModalRegistro";
const overlayStyle = {
  position:"fixed",left:0,top:0,width:"100vw",height:"100vh",
  background:"rgba(24,26,32,.93)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1500
};
const modalStyle = {
  background:"#23272F", padding:32, borderRadius:16, minWidth:340,
  boxShadow:"0 8px 32px #44FF4411", color:"#e0e0e0", textAlign:"center"
};
const btnStyle = {
  display:"block", width:"100%", marginTop:10, marginBottom:8,
  background:"#24D05A", color:"#181A20", fontWeight:700, borderRadius:4,
  border:"none", padding:"10px 0", fontSize:16, cursor:"pointer"
};
export default function ModalAuth({ mode, setMode, onClose, onLogin, onRegister }) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {!mode && (
          <>
            <h2 style={{color:"#44FF44"}}>¡Bienvenido a WHOAMI!</h2>
            <p>Para continuar debes iniciar sesión o registrarte.</p>
            <button onClick={() => setMode("login")} style={btnStyle}>Iniciar sesión</button>
            <button onClick={() => setMode("registro")} style={btnStyle}>Registrarse</button>
            <button onClick={onClose} style={{...btnStyle, background:"#23272F", color:"#0CE0FF", border:"2px solid #0CE0FF"}}>Cancelar</button>
          </>
        )}
        {mode === "login" && <ModalLogin onLogin={onLogin} onCancel={onClose} />}
        {mode === "registro" && <ModalRegistro onRegister={onRegister} onCancel={onClose} />}
      </div>
    </div>
  );
}
