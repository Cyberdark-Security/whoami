import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // ajusta ruta

export default function Registro() {
  const { login } = useAuth();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        login(data.user);
        navigate("/");
      } else if (res.status === 409) {
        setError("El correo ya está registrado.");
      } else {
        setError(data.error || "Hubo un error en el registro.");
      }
    } catch (err) {
      setError("Error de conexión");
      console.error(err);
    }
  };

  return (
    <form className="cyber-form" onSubmit={handleSubmit}>
      {/* tu formulario igual */}
    </form>
  );
}
