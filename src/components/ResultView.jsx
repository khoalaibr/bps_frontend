// src/components/ResultView.jsx
import React from 'react';
import './ResultView.css'; // Archivo CSS personalizado

const ResultView = ({ data }) => {
  if (!data.length) return null;

  return (
    <div className="result-container">
      {data.map((item, index) => (
        <div key={index} className="result-card">
          {/* Datos principales del GAP */}
          <div className="gap-data">
            <div className="gap-item">
              <span className="label">Documento:</span> {item.documento}
            </div>
            <div className="gap-item">
              <span className="label">Nombre:</span> {item.nombreCompleto}
            </div>
            <div className="gap-item">
              <span className="label">Fecha de Entrega:</span> {item.fechaEntrega}
            </div>
          </div>
          <div className="divider"></div>
          {/* Atenciones del VTIGER */}
          <div className="atenciones">
            {item.atenciones.map((atencion, idx) => (
              <div key={idx} className="atencion-item">
                {atencion.subtopicname === 'No registro atencion' ? (
                  <span className="no-atencion">No registro atención</span>
                ) : (
                  <>
                    <div className="atencion-detail">
                      <span className="label">Modificado Por:</span> {atencion.modificadoPor}
                    </div>
                    <div className="atencion-detail">
                      <span className="label">Subtópico:</span> {atencion.subtopicname}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultView;
