import React, { useState, useEffect } from "react";
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
  // Solo verifica la existencia y validez mínima del token
  const token = localStorage.getItem("token");
  return !!token;
}

function App() {
  const [forceUpdate, setForceUpdate] = useState(0);

  // Para refrescar UI tras login/logout admin
  function handleAdminLogin() {
    setForceUpdate(forceUpdate + 1);
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
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
