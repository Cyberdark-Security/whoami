import React, { useState } from "react";
import ModalEnviarEvidencia from "./ModalEnviarEvidencia";
export default function Labs({ labs, user, setUser, onOpenAuthModal }) {
  const [modalLab, setModalLab] = useState(null);

  const handleEnviarEvidencia = (labId, nombre, url) => {
    alert("Tu evidencia fue enviada, el admin la validará.");
    setModalLab(null);
  };

  return (
    <div>
      <h1 style={{color:"#44FF44", fontWeight: 700, fontSize: 32, marginBottom: 16}}>Laboratorios Dockerizados</h1>
      {labs.map(lab => (
        <div key={lab.id} style={{
          background: "#23272F",
          color: "#e0e0e0",
          padding: 20,
          marginBottom: 20,
          borderRadius: 8,
          borderLeft: "5px solid #44FF44",
          boxShadow: "0 2px 16px #0CE0FF20",
        }}>
          <h3 style={{ color: "#24D05A" }}>{lab.title}</h3>
          <a
            href={lab.megaLink}
            style={{
              color: "#0CE0FF", fontWeight: 600, textDecoration: "underline"
            }}
            download
            target="_blank"
            rel="noopener"
            onClick={e => {
              if (!user) {
                e.preventDefault();
                onOpenAuthModal("login");
              }
            }}
          >
            Descargar
          </a>
          <button
            style={{
              background: "#24D05A",
              color: "#181A20",
              marginLeft: 10,
              fontWeight: 700,
              borderRadius: 3,
              padding: "5px 12px",
              border: "none"
            }}
            onClick={() => user ? setModalLab(lab) : onOpenAuthModal("login")}
          >
            Enviar evidencia
          </button>
        </div>
      ))}
      {modalLab && <ModalEnviarEvidencia
        lab={modalLab}
        user={user}
        onSend={handleEnviarEvidencia}
        onCancel={() => setModalLab(null)}
      />}
    </div>
  );
}
