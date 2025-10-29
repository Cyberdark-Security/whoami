import React, { useEffect, useState } from "react";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRanking();
  }, []);

  async function fetchRanking() {
    try {
      setLoading(true);
      setError("");
      // Reemplaza esta URL con la de tu API real que devuelve ranking
      const res = await fetch('/api/ranking');
      if (!res.ok) throw new Error("Error cargando ranking");
      const data = await res.json();
      setRanking(data.ranking);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Cargando ranking...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: 700, margin: "24px auto", fontFamily: "'Fira Mono', monospace", color: "#44FF44" }}>
      <h1>Ranking de Usuarios</h1>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        color: '#44FF44'
      }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #24D05A" }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Usuario</th>
            <th style={{ textAlign: 'center', padding: '8px' }}>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map(({ user_id, username, puntos }) => (
            <tr key={user_id} style={{ borderBottom: "1px solid #0CE0FF50" }}>
              <td style={{ padding: '10px 8px' }}>{username}</td>
              <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 'bold' }}>{puntos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
