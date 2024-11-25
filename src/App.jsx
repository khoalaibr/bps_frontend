// src/App.jsx
import React, { useState } from 'react';
import { Container, Button, Typography } from '@mui/material';
import FileUploader from './components/FileUploader';
import ResultView from './components/ResultView';
import { processFiles } from './utils/processor';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

function App() {
  const [gapFile, setGapFile] = useState(null);
  const [vtigerFile, setVtigerFile] = useState(null);
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!gapFile || !vtigerFile) {
      alert('Por favor, carga ambos archivos.');
      return;
    }

    setLoading(true);
    try {
      const data = await processFiles(gapFile, vtigerFile);
      setProcessedData(data);
      if (data.length === 0) {
        alert('No se encontraron coincidencias después del procesamiento.');
      } else {
        alert('Procesamiento completado exitosamente.');
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar los archivos.');
    }
    setLoading(false);
  };

  const handleDownload = (format) => {
    if (!processedData.length) {
      alert('No hay datos para descargar.');
      return;
    }

    let blob;
    if (format === 'json') {
      const jsonString = JSON.stringify(processedData, null, 2);
      blob = new Blob([jsonString], { type: 'application/json' });
      saveAs(blob, 'resultado.json');
    } else if (format === 'csv') {
      // Convertir la estructura de datos a una plana para CSV
      const csvData = [];
      processedData.forEach((item) => {
        if (item.atenciones.length > 0) {
          item.atenciones.forEach((atencion) => {
            csvData.push({
              Documento: item.documento,
              'Nombre Completo': item.nombreCompleto,
              'Fecha Entrega': item.fechaEntrega,
              'Modificado por': atencion.modificadoPor,
              'subtopicname': atencion.subtopicname,
            });
          });
        } else {
          csvData.push({
            Documento: item.documento,
            'Nombre Completo': item.nombreCompleto,
            'Fecha Entrega': item.fechaEntrega,
            'Modificado por': '',
            'subtopicname': 'No registro atencion',
          });
        }
      });
      const csv = Papa.unparse(csvData);
      blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'resultado.csv');
    } else if (format === 'excel') {
      // Igual que en CSV, aplanar los datos
      const excelData = [];
      processedData.forEach((item) => {
        if (item.atenciones.length > 0) {
          item.atenciones.forEach((atencion) => {
            excelData.push({
              Documento: item.documento,
              'Nombre Completo': item.nombreCompleto,
              'Fecha Entrega': item.fechaEntrega,
              'Modificado por': atencion.modificadoPor,
              'subtopicname': atencion.subtopicname,
            });
          });
        } else {
          excelData.push({
            Documento: item.documento,
            'Nombre Completo': item.nombreCompleto,
            'Fecha Entrega': item.fechaEntrega,
            'Modificado por': '',
            'subtopicname': 'No registro atencion',
          });
        }
      });
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, 'resultado.xlsx');
    }

    alert(`Archivo descargado en formato ${format.toUpperCase()}.`);
  };

  return (
    <Container>
      <Typography variant="h4" style={{ marginTop: '20px', marginBottom: '20px' }}>
        Comparador de Archivos
      </Typography>
      <FileUploader
        label="Cargar Archivo GAP"
        onFileUpload={setGapFile}
        fileName={gapFile && gapFile.name}
      />
      <FileUploader
        label="Cargar Archivo VTIGER"
        onFileUpload={setVtigerFile}
        fileName={vtigerFile && vtigerFile.name}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleProcess}
        disabled={loading}
        style={{ marginTop: '10px' }}
      >
        {loading ? 'Procesando...' : 'Procesar Archivos'}
      </Button>
      {processedData.length > 0 && (
        <>
          <Typography variant="h5" style={{ marginTop: '30px' }}>
            Resultados del Procesamiento
          </Typography>
          <div style={{ marginTop: '20px' }}>
            <ResultView data={processedData} />
          </div>
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Descargar Resultados
          </Typography>
          <Button
            variant="outlined"
            onClick={() => handleDownload('json')}
            style={{ marginRight: '10px' }}
          >
            Descargar JSON
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleDownload('csv')}
            style={{ marginRight: '10px' }}
          >
            Descargar CSV
          </Button>
          <Button variant="outlined" onClick={() => handleDownload('excel')}>
            Descargar Excel
          </Button>
        </>
      )}
    </Container>
  );
}

export default App;
