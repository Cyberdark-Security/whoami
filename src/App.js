import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Login from "./Login";
import Registro from "./Registro";
import Home from "./Home";
import Ranking from "./Ranking";
import Labs from "./Labs";
import AdminWriteups from "./AdminWriteups";
import AdminLogin from "./AdminLogin";

function isAdminLogged() {
  const token = localStorage.getItem("token");
  return !!token;
}

function App() {
  const [user, setUser] = useState(() => {
    const almacenado = localStorage.getItem("user");
    return almacenado ? JSON.parse(almacenado) : null;
  });

  const [forceUpdate, setForceUpdate] = useState(0);

  function handleAdminLogin() {
    setForceUpdate(forceUpdate + 1);
  }

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/ranking" element={<Ranking user={user} />} />
        <Route path="/labs" element={<Labs user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/registro" element={<Registro setUser={setUser} />} />
        <Route
          path="/admin/login"
          element={<AdminLogin onLogin={handleAdminLogin} />}
        />
        <Route
          path="/admin/panel"
          element={
            isAdminLogged() ? (
              <AdminWriteups />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
