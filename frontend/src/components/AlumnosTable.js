import React, { useState } from "react";
import { updateNotasMesa } from "../services/apiService";

const AlumnosTable = ({ alumnos, openModal, mesa }) => {
  const [notas, setNotas] = useState({});

  const handleNotaChange = (id_estudiante, valor) => {
    setNotas((prev) => ({
      ...prev,
      [id_estudiante]: valor,
    }));
  };

  const guardarNotas = async () => {
    const datosNotas = alumnos
      .filter((alumno) => notas[alumno.id_estudiante] !== undefined)
      .map((alumno) => ({
        id_estudiante: alumno.id_estudiante,
        nota: notas[alumno.id_estudiante],
      }));

    console.log("Notas enviadas al backend:", JSON.stringify({ notas: datosNotas }, null, 2));

    if (datosNotas.length === 0) {
      alert("No hay notas para enviar.");
      return;
    }
    try {
      await updateNotasMesa(mesa.id_mesa, datosNotas);
      alert("Notas guardadas correctamente");
    } catch (error) {
      console.error("Error al enviar las notas:", error);
      alert("Hubo un problema al conectar con el servidor.");
    }
  };

  return (
    <div className="table-container">
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
              <th>Nota</th>
              <th>Nota Prueba</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => {
              let rowClass = "";
              if (alumno.inscripto && !alumno.presente) {
                rowClass = "row-enrolled-not-present";
              } else if (!alumno.inscripto && alumno.presente) {
                rowClass = "row-not-enrolled";
              } else if (alumno.inscripto && alumno.presente) {
                rowClass = "row-present-enrolled";
              }
              return (
                <tr key={alumno.id_estudiante} className={rowClass}>
                  <td>{alumno.inscripto ? "Sí" : "No"}</td>
                  <td>{alumno.presente ? "Sí" : "No"}</td>
                  <td>{alumno.lu}</td>
                  <td>{alumno.doc}</td>
                  <td>{alumno.nro_identidad}</td>
                  <td>{alumno.nombre_completo}</td>
                  <td>{alumno.carrera}</td>
                  <td>{alumno.plan}</td>
                  <td>{alumno.codigo}</td>
                  <td>{alumno.calidad}</td>
                  <td>
                    <button onClick={() => openModal("AlumnoUpdate", alumno)} className="open-modal-button">
                      Realizar Cambios
                    </button>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={notas[alumno.id_estudiante] ?? alumno.nota ?? "-"}
                      onChange={(e) => handleNotaChange(alumno.id_estudiante, e.target.value)}
                    />
                  </td>
                  <td>{alumno.nota}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={guardarNotas} className="open-modal-button">
        Guardar Notas
      </button>
    </div>
  );
};

export default AlumnosTable;