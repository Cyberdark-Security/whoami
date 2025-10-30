import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import AdminWriteups from "./writeups"; // o tu componente real

export default function AdminPanel() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "admin") {
      setAdmin(true);
    } else {
      navigate("/admin/login", { replace: true });
    }
    setLoading(false);
  }, [navigate]);

  if (loading) return null;
  if (!admin) return null;

  return (
    <div>
      <h1 style={{
        color: "#39ff14",
        fontFamily: "monospace",
        margin: "2em 0",
        fontWeight: 900,
        fontSize: "2.2em"
      }}>
        Revisión de Writeups Pendientes
      </h1>
      {/* Aquí tu componente lista/aprobación */}
      {/* <AdminWriteups /> */}
    </div>
  );
}
