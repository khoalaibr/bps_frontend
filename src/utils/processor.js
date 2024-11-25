import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { format, parse } from 'date-fns';

const normalizeData = (data) => {
  return data.map((item) => {
    const newItem = {};
    Object.keys(item).forEach((key) => {
      const newKey = key
        .replace(/"/g, '')
        .replace(/\t/g, '')
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      const value = item[key];
      const cleanedValue = typeof value === 'string' ? value.trim() : value;

      newItem[newKey] = cleanedValue;
    });
    return newItem;
  });
};

const formatDate = (dateString) => {
  if (typeof dateString !== 'string') {
    console.warn(`Formato inválido detectado: ${dateString}`);
    return null; // Devuelve null si no es una cadena
  }

  let date;
  // Intentar diferentes formatos
  date = parse(dateString, 'dd/MM/yy HH:mm', new Date());
  if (!isNaN(date)) {
    return format(date, 'dd/MM/yyyy');
  }
  date = parse(dateString, 'dd/MM/yyyy HH:mm', new Date());
  if (!isNaN(date)) {
    return format(date, 'dd/MM/yyyy');
  }
  date = parse(dateString, 'dd/MM/yy', new Date());
  if (!isNaN(date)) {
    return format(date, 'dd/MM/yyyy');
  }
  date = parse(dateString, 'dd/MM/yyyy', new Date());
  if (!isNaN(date)) {
    return format(date, 'dd/MM/yyyy');
  }
  console.warn(`Fecha no válida: ${dateString}`);
  return null; // Devuelve null si no puede parsear la fecha
};

export const processFiles = async (gapFile, vtigerFile) => {
  const gapData = await readFile(gapFile);
  const vtigerData = await readFile(vtigerFile);

  const gapDataNormalized = normalizeData(gapData);
  const vtigerDataNormalized = normalizeData(vtigerData);

  const vtigerIndex = vtigerDataNormalized.reduce((index, item) => {
    const key = String(item['accdocumentnumber'] || '').trim();
    if (!index[key]) {
      index[key] = [];
    }
    index[key].push(item);
    return index;
  }, {});

  const filteredGap = gapDataNormalized.filter((item) => item['Estado'] === 'Finalizado');

  const result = filteredGap.map((gapItem) => {
    const nombreCompleto = `${gapItem['Nombre']} ${gapItem['Apellido']}`.trim();
    const gapDocumento = String(gapItem['Documento'] || '').trim();
    const gapFechaEntrega = formatDate(String(gapItem['Fecha Entrega'] || '').trim());

    const matchingVtigerEntries = vtigerIndex[gapDocumento] || [];

    if (matchingVtigerEntries.length === 0) {
      return {
        documento: gapDocumento,
        nombreCompleto,
        fechaEntrega: gapFechaEntrega || 'Fecha no disponible',
        atenciones: [
          {
            modificadoPor: '',
            subtopicname: 'No registro atencion',
          },
        ],
      };
    }

    const atenciones = matchingVtigerEntries.map((vtigerItem) => ({
      modificadoPor: vtigerItem['Modificado por'] || '',
      subtopicname: vtigerItem['subtopicname'] || '',
      fechaModificacion: formatDate(String(vtigerItem['Fecha de Modificacion'] || '').trim()) || 'Fecha no disponible',
    }));

    return {
      documento: gapDocumento,
      nombreCompleto,
      fechaEntrega: gapFechaEntrega || 'Fecha no disponible',
      atenciones,
    };
  });

  return result;
};

const readFile = (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  if (extension === 'csv') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      });
    });
  } else if (extension === 'xlsx') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
          resolve(sheet);
        } catch (err) {
          reject(`Error al procesar archivo Excel: ${err.message}`);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  } else {
    return Promise.reject('Formato de archivo no soportado.');
  }
};
