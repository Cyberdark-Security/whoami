import React, { useState, useEffect } from "react";
import "./styles/AdminWriteups.css";

export default function AdminWriteups() {
  const [writeups, setWriteups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWriteup, setSelectedWriteup] = useState(null);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingWriteups();
  }, []);

  const fetchPendingWriteups = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("🔄 Obteniendo writeups pendientes...");
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No estás autenticado como admin");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/admin/writeups-pending", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("📊 Respuesta del servidor:", data);

      if (data.data && Array.isArray(data.data)) {
        setWriteups(data.data);
        console.log(`✅ ${data.data.length} writeups encontrados`);
      } else if (Array.isArray(data)) {
        setWriteups(data);
        console.log(`✅ ${data.length} writeups encontrados`);
      } else {
        console.warn("⚠️ Estructura de respuesta inesperada:", data);
        setWriteups([]);
      }
    } catch (err) {
      console.error("❌ Error fetching:", err);
      setError(`Error cargando writeups: ${err.message}`);
      setWriteups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (writeupId, approvalStatus) => {
    if (!window.confirm(`¿Seguro que deseas ${approvalStatus} este writeup?`)) {
      return;
    }

    setApproving(true);
    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch("/api/admin/approve-writeup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          writeupId,
          aprobar: approvalStatus === 'aprobado'
        })
      });

      if (res.ok) {
        const responseData = await res.json();
        console.log("✅ Respuesta:", responseData);
        
        setWriteups(writeups.filter(w => w.id !== writeupId));
        setSelectedWriteup(null);
        alert(`✅ Writeup ${approvalStatus}`);
      } else {
        const errorData = await res.json();
        console.error("❌ Error del servidor:", errorData);
        alert(`❌ Error: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert(`❌ Error al procesar: ${err.message}`);
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">⏳ Cargando writeups...</div>;
  }

  return (
    <div className="admin-writeups">
      <h2>📋 Revisión de Writeups Pendientes</h2>

      {error && (
        <div style={{
          background: "rgba(255,0,0,0.1)",
          border: "1px solid #ff0000",
          color: "#ff6666",
          padding: 15,
          borderRadius: 4,
          marginBottom: 20
        }}>
          ❌ {error}
        </div>
      )}

      {writeups.length === 0 ? (
        <div className="no-writeups">
          ✅ No hay writeups pendientes por revisar
        </div>
      ) : (
        <div className="writeups-container">
          <div className="writeups-list">
            {writeups.map(w => (
              <div
                key={w.id}
                className={`writeup-item ${selectedWriteup?.id === w.id ? 'active' : ''}`}
                onClick={() => setSelectedWriteup(w)}
              >
                <div className="writeup-header">
                  <h3>{w.lab_title}</h3>
                  <span className="status-badge">{w.status}</span>
                </div>
                <p className="writeup-author">
                  👤 {w.nombre} {w.apellido}
                </p>
                <p className="writeup-date">
                  📅 {new Date(w.submitted_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            ))}
          </div>

          {selectedWriteup && (
            <div className="writeup-detail">
              <h3>📝 {selectedWriteup.lab_title}</h3>

              <div className="detail-section">
                <label>👤 Usuario:</label>
                <p>
                  {selectedWriteup.nombre} {selectedWriteup.apellido}
                  <br />
                  <small>{selectedWriteup.email}</small>
                </p>
              </div>

              <div className="detail-section">
                <label>📅 Fecha de envío:</label>
                <p>
                  {new Date(selectedWriteup.submitted_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className="detail-section">
                <label>📄 Evidencia / Writeup:</label>
                <div className="evidence-container">
                  {selectedWriteup.evidence && selectedWriteup.evidence.startsWith('http') ? (
                    <a 
                      href={selectedWriteup.evidence} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="evidence-link"
                    >
                      🔗 Ver evidencia externa
                    </a>
                  ) : (
                    <p className="evidence-text">{selectedWriteup.evidence}</p>
                  )}
                </div>
              </div>

              <div className="actions">
                <button
                  className="btn btn-approve"
                  onClick={() => handleApprove(selectedWriteup.id, 'aprobado')}
                  disabled={approving}
                >
                  ✅ Aprobar
                </button>
                <button
                  className="btn btn-reject"
                  onClick={() => handleApprove(selectedWriteup.id, 'rechazado')}
                  disabled={approving}
                >
                  ❌ Rechazar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="info-banner">
        <p>Total pendientes: <strong>{writeups.length}</strong></p>
      </div>
    </div>
  );
}
