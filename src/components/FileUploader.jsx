// src/components/FileUploader.jsx
import React from 'react';
import { Button, Typography } from '@mui/material';

const FileUploader = ({ label, onFileUpload, fileName }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      onFileUpload(file);
    } else {
      alert('Por favor, carga un archivo válido (.csv o .xlsx).');
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Button variant="contained" component="label">
        {label}
        <input type="file" accept=".csv, .xlsx" hidden onChange={handleFileChange} />
      </Button>
      {fileName && (
        <Typography variant="body2" style={{ marginTop: '5px' }}>
          Archivo cargado: {fileName}
        </Typography>
      )}
    </div>
  );
};

export default FileUploader;
