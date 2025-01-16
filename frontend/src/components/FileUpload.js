import React from 'react';

const FileUpload = ({ onFileChange }) => (
  <div className="form-group">
    <label htmlFor="archivo">Cargar Alumnos (Excel):</label>
    <input
      type="file"
      id="archivo"
      accept=".xlsx, .xls"
      onChange={onFileChange}
    />
  </div>
);

export default FileUpload;
