import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import '../styles/FileModal.css';

const FileModal = ({ alumnos, onClose, materia, fecha }) => {
  const columns = [
    'inscripto',
    'presente',
    'lu',
    'doc',
    'nro_identidad',
    'nombre_completo',
    'carrera',
    'plan',
    'codigo',
    'calidad',
  ];
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const [includeAusentes, setIncludeAusentes] = useState(true);
  const [includeInscriptos, setIncludeInscriptos] = useState(true);

  const handleColumnChange = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const generateExcel = () => {
    let filteredAlumnos = alumnos;

    if (!includeAusentes) {
      filteredAlumnos = filteredAlumnos.filter((alumno) => alumno.presente);
    }

    if (!includeInscriptos) {
      filteredAlumnos = filteredAlumnos.filter((alumno) => !alumno.inscripto);
    }

    const dataToExport = filteredAlumnos.map((alumno) =>
      selectedColumns.reduce((acc, col) => {
        acc[col] = alumno[col];
        return acc;
      }, {})
    );

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alumnos');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const nombreMesa = `${materia}_${fecha.toString()}.xlsx`;

    saveAs(blob, nombreMesa);
    onClose();
  };

  return (
    <div className="modal-content">
      <h2>Generar Excel</h2>
      <div>
        <h3>Seleccionar columnas</h3>
        <select multiple className="column-select" value={selectedColumns} onChange={(e) => handleColumnChange(e.target.value)}>
          {columns.map((col) => (
            <option key={col} value={col}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col)}
                  onChange={() => handleColumnChange(col)}
                />
                {col}
              </label>
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <h4>Incluir ausentes</h4>
          <input
            type="checkbox"
            checked={includeAusentes}
            onChange={(e) => setIncludeAusentes(e.target.checked)}
          />
        <h4>Incluir inscriptos</h4>
          <input
            type="checkbox"
            checked={includeInscriptos}
            onChange={(e) => setIncludeInscriptos(e.target.checked)}
          />
      </div>
      <button onClick={generateExcel}>Descargar Excel</button>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default FileModal;
