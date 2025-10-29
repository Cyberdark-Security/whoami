import React, { useState } from "react";
import Labs from "./Labs";
import Navbar from "./Navbar";
import ModalAuth from "./ModalAuth";

const LABS = [
  { id: 1, title: "Lab 1: Escalada de privilegios - CVE-2025-32463", megaLink: "https://mega.nz/ejemplo-lab1" },
  { id: 2, title: "Lab 2: Pivoting multi-nube Azure-AWS", megaLink: "https://mega.nz/ejemplo-lab2" },
  { id: 3, title: "Lab 3: Configuraciones inseguras Docker", megaLink: "https://mega.nz/ejemplo-lab3" }
];

function App() {
  const [user, setUser] = useState(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState(null);

  const onOpenAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  return (
    <div>
      <Navbar user={user} setUser={setUser} onOpenAuthModal={onOpenAuthModal} />
      <main style={{ maxWidth: 800, margin: "50px auto", padding: 24 }}>
        <Labs
          labs={LABS}
          user={user}
          setUser={setUser}
          onOpenAuthModal={onOpenAuthModal}
        />
      </main>
      <footer style={{ color: "#0CE0FF", textAlign: "center", fontFamily: "Fira Mono", marginTop: 40 }}>
        © 2025 WHOAMI. Todos los derechos reservados.
      </footer>
      {showAuthModal && (
        <ModalAuth
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}

export default App;
