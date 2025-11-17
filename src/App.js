import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Login from "./Login";
import Registro from "./Registro";
import Home from "./Home";
import Writeups from "./Writeups";
import Contacto from "./Contacto"; 
import Ranking from "./Ranking";
import Labs from "./Labs";
import AdminPanel from './admin/panel';  // ← Este es el correcto


function isAdminLogged() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.role === "admin";
}


function App() {
  const [user, setUser] = useState(() => {
    const almacenado = localStorage.getItem("user");
    return almacenado ? JSON.parse(almacenado) : null;
  });

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/ranking" element={<Ranking user={user} />} />
        <Route path="/writeups" element={<Writeups />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/labs" element={<Labs user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/registro" element={<Registro setUser={setUser} />} />
        
        {/* ← PANEL DE ADMIN - PROTEGIDO */}
        <Route
          path="/admin/panel"
          element={
            isAdminLogged() ? (
              <AdminPanel />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
