import React, { createContext, useState, useContext } from "react";

// Crear contexto
export const AuthContext = createContext();

// Provider de autenticación
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Función para login y guardar usuario
  function login(userData) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  // Función para logout y limpiar
  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar contexto fácilmente
export function useAuth() {
  return useContext(AuthContext);
}
