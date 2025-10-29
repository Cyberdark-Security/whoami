import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext"; // ajusta ruta según tu proyecto
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
  const [forceUpdate, setForceUpdate] = useState(0);

  function handleAdminLogin() {
    setForceUpdate(forceUpdate + 1);
  }

  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
