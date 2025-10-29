import React, { useState } from "react";
import Labs from "./Labs";
import Navbar from "./Navbar";

const LABS = [
  { id: 1, title: "Lab 1: Escalada de privilegios - CVE-2025-32463", megaLink: "https://mega.nz/ejemplo-lab1" },
  { id: 2, title: "Lab 2: Pivoting multi-nube Azure-AWS", megaLink: "https://mega.nz/ejemplo-lab2" },
  { id: 3, title: "Lab 3: Configuraciones inseguras Docker", megaLink: "https://mega.nz/ejemplo-lab3" }
];

function App() {
  // Estado global del usuario (no requiere login hasta que decide enviar evidencia o pedir puntos)
  const [user, setUser] = useState(null);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <main style={{maxWidth: 800, margin: "50px auto", padding: 24}}>
        <Labs labs={LABS} user={user} setUser={setUser}/>
      </main>
      <footer style={{ color:"#0CE0FF", textAlign: "center", fontFamily: "Fira Mono", marginTop: 40 }}>
        © 2025 WHOAMI. Todos los derechos reservados.
      </footer>
    </div>
  );
}
export default App;
