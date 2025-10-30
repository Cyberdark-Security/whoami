import React, { useEffect, useState } from "react";
export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  useEffect(() => {
    fetch("/api/ranking")
      .then(r => r.json())
      .then(data => setRanking(data.ranking || []));
  }, []);
  return (
    <section style={{ margin: "3em auto", maxWidth: 600 }}>
      <h2 style={{
        color: "#39ff14", fontSize: "2.2em", fontFamily: "monospace", fontWeight:900
      }}>
        Ranking de Usuarios
      </h2>
      <table style={{
        width: "100%", background: "#23272f", color: "#fff",
        borderRadius: 8, overflow: "hidden", fontFamily:"monospace", fontSize:"1.2em"
      }}>
        <thead>
          <tr style={{ background: "#18191b" }}>
            <th style={{ color: "#39ff14", textAlign:"left", padding:"0 1em" }}>Usuario</th>
            <th style={{ color: "#39ff14", textAlign:"center" }}>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((u, i) => (
            <tr key={u.user_id} style={{borderBottom:"1px solid #39ff1480"}}>
              <td style={{padding:"0 1em"}}>{u.username}</td>
              <td style={{textAlign:"center"}}>{u.puntos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
