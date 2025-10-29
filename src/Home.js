import React from "react";

export default function Home() {
  const labs = [
    {
      id: 1,
      title: "Lab 1: Escalada de privilegios - CVE-2025-32463",
      downloadLink: "#",
      submitEvidenceLink: "#"
    },
    {
      id: 2,
      title: "Lab 2: Pivoting multi-nube Azure-AWS",
      downloadLink: "#",
      submitEvidenceLink: "#"
    },
    {
      id: 3,
      title: "Lab 3: Configuraciones inseguras Docker",
      downloadLink: "#",
      submitEvidenceLink: "#"
    }
  ];

  return (
    <main style={{ padding: '40px 24px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{
        color: '#44FF44',
        fontFamily: "'Fira Mono', monospace",
        marginBottom: 24
      }}>
        Laboratorios Dockerizados de Pentesting
      </h1>

      {labs.map(({ id, title, downloadLink, submitEvidenceLink }) => (
        <section key={id} style={{
          background: '#23272F',
          borderLeft: '6px solid #44FF44',
          borderRadius: 12,
          boxShadow: '0 2px 12px #062c1712',
          marginBottom: 24,
          padding: 20,
          fontFamily: "'Fira Mono', monospace",
          color: '#44FF44'
        }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <div style={{ marginTop: 12 }}>
            <a href={downloadLink} style={{
              color: '#0CE0FF',
              fontWeight: 600,
              marginRight: 18,
              textDecoration: 'underline',
              cursor: 'pointer'
            }}>Descargar</a>
            <button style={{
              backgroundColor: '#44FF44',
              border: 'none',
              borderRadius: 4,
              padding: '6px 14px',
              color: '#181A20',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            onClick={() => alert(`Enviar evidencia para ${title}`)}
            >
              Enviar evidencia
            </button>
          </div>
        </section>
      ))}

      <footer style={{
        fontFamily: "'Fira Mono', monospace",
        color: '#0CE0FF',
        fontSize: '1.14rem',
        marginTop: 40,
        textAlign: 'center'
      }}>
        © 2025 WHOAMI. Todos los derechos reservados.
      </footer>
    </main>
  );
}
