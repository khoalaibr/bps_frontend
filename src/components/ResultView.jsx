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
        gap: 3, // Más espacio entre las tarjetas
        padding: 3,
        backgroundColor: '#f4f4f4', // Fondo suave para todo el contenedor
      }}
    >
      {data.map((item, index) => (
        <Card
          key={index}
          sx={{
            borderRadius: 2,
            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)', // Sombra más pronunciada
            overflow: 'hidden',
            padding: 2, // Espaciado interno
          }}
        >
          <CardContent>
            {/* Datos principales del GAP */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#222', // Más contraste
                marginBottom: 1,
              }}
            >
              Documento: {item.documento}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 'bold',
                color: '#333', // Texto destacado
                marginBottom: 1,
              }}
            >
              Nombre: {item.nombreCompleto}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 2,
              }}
            >
              Fecha de Entrega: {item.fechaEntrega}
            </Typography>
            <Divider />
            {/* Atenciones del VTIGER */}
            <Box sx={{ marginTop: 2 }}>
              {item.atenciones.map((atencion, idx) => (
                <Box
                  key={idx}
                  sx={{
                    padding: 1,
                    backgroundColor: '#ffffff', // Fondo blanco
                    border: '1px solid #ddd', // Borde sutil
                    borderRadius: 1,
                    marginBottom: 1,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: '#f7f7f7', // Fondo al pasar el mouse
                    },
                  }}
                >
                  {atencion.subtopicname === 'No registro atencion' ? (
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: 'italic',
                        fontSize: '0.9rem',
                        color: '#888',
                      }}
                    >
                      No registro atención
                    </Typography>
                  ) : (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          color: '#444',
                        }}
                      >
                        Modificado Por: {atencion.modificadoPor}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.85rem',
                          color: '#666',
                        }}
                      >
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
