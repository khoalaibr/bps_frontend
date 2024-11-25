// src/components/ResultView.jsx
import React from 'react';
import { Typography, Card, CardContent, Box, Divider } from '@mui/material';

const ResultView = ({ data }) => {
  if (!data.length) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      {data.map((item, index) => (
        <Card
          key={index}
          sx={{
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              Documento: {item.documento}
            </Typography>
            <Typography variant="body2" sx={{ color: '#555', marginBottom: 1 }}>
              Nombre: {item.nombreCompleto}
            </Typography>
            <Typography variant="body2" sx={{ color: '#555', marginBottom: 2 }}>
              Fecha de Entrega: {item.fechaEntrega}
            </Typography>
            <Divider />
            <Box sx={{ marginTop: 2 }}>
              {item.atenciones.map((atencion, idx) => (
                <Box
                  key={idx}
                  sx={{
                    padding: 1,
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    marginBottom: 1,
                  }}
                >
                  {atencion.subtopicname === 'No registro atencion' ? (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#888' }}>
                      No registro atención
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Modificado Por: {atencion.modificadoPor}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#555' }}>
                        Subtópico: {atencion.subtopicname}
                      </Typography>
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ResultView;
