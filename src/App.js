import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Labs from "./Labs";
import Navbar from "./Navbar";
import Ranking from "./Ranking";
import Writeups from "./Writeups";
import Contacto from "./Contacto";
import Login from "./Login";
import Registro from "./Registro";

const LABS = [
  { id: 1, title: "Lab 1: Escalada de privilegios - CVE-2025-32463", megaLink: "https://mega.nz/ejemplo-lab1" },
  { id: 2, title: "Lab 2: Pivoting multi-nube Azure-AWS", megaLink: "https://mega.nz/ejemplo-lab2" },
  { id: 3, title: "Lab 3: Configuraciones inseguras Docker", megaLink: "https://mega.nz/ejemplo-lab3" }
];

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <main style={{ maxWidth: 800, margin: "50px auto", padding: 24 }}>
        <Routes>
          <Route path="/" element={
            <Labs
              labs={LABS}
              user={user}
              setUser={setUser}
            />
          } />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/writeups" element={<Writeups />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/registro" element={<Registro setUser={setUser} />} />
        </Routes>
      </main>
      <footer style={{ color: "#0CE0FF", textAlign: "center", fontFamily: "Fira Mono", marginTop: 40 }}>
        © 2025 WHOAMI. Todos los derechos reservados.
      </footer>
    </Router>
  );
}

export default App;
