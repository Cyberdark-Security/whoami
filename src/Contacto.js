import React from "react";

export default function Contacto() {
  return (
    <main style={{
      maxWidth: "600px", margin: "3rem auto", background: "#1b1b1c",
      border: "1px solid #39ff14", borderRadius: "8px", padding: "2rem"
    }}>
      <h2 style={{ color: "#39ff14" }}>Contacto</h2>
      <p>
        Esta página está enfocada a la enseñanza y práctica educativa de pentesting y ciberseguridad. Si tienes dudas o comentarios, no dudes en escribir a nuestro correo:
      </p>
      <p>
        <a  
          href="mailto:ing.mauricio1983@gmail.com" 
          style={{color: "#0ff", fontWeight:"bold"}}>
          ing.mauricio1983@gmail.com
        </a>
      </p>
      <p style={{fontSize:"0.95em", color:"#9aebc8"}}>
        WHOAMI es una plataforma para aprender hacking, análisis y seguridad informática en entornos seguros y orientados a la educación.
      </p>
    </main>
  );
}
