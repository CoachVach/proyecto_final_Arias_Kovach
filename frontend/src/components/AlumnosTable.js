import React from 'react';

const AlumnosTable = ({ alumnos, openModal }) => {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Inscripto</th>
            <th>Presente</th>
            <th>LU</th>
            <th>Doc</th>
            <th>Número Identidad</th>
            <th>Nombre Completo</th>
            <th>Carrera</th>
            <th>Plan</th>
            <th>Código</th>
            <th>Calidad</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => {
            let rowClass = '';
            if (alumno.inscripto && !alumno.presente) {
              rowClass = 'row-enrolled-not-present';
            } else if (!alumno.inscripto && alumno.presente) {
              rowClass = 'row-not-enrolled';
            } else if (alumno.inscripto && alumno.presente) {
              rowClass = 'row-present-enrolled';
            }

            return (
              <tr key={alumno.id_estudiante} className={rowClass}>
                <td>{alumno.inscripto ? 'Sí' : 'No'}</td>
                <td>{alumno.presente ? 'Sí' : 'No'}</td>
                <td>{alumno.lu}</td>
                <td>{alumno.doc}</td>
                <td>{alumno.nro_identidad}</td>
                <td>{alumno.nombre_completo}</td>
                <td>{alumno.carrera}</td>
                <td>{alumno.plan}</td>
                <td>{alumno.codigo}</td>
                <td>{alumno.calidad}</td>
                <td>
                  <button
                    onClick={() => openModal('AlumnoUpdate', alumno)}
                    className="open-modal-button"
                  >
                    Realizar Cambios
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AlumnosTable;
