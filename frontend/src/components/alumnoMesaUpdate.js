import React, {useState } from 'react';
import '../styles/CrearMesaPage.css';
const AlumnoMesaUpdate = ({alumno, id_mesa}) =>{
    const [inscripto, setInscripto] = useState(alumno.inscripto);
    const [presente, setPresente] = useState(alumno.presente);
    const [carrera, setCarrera] = useState(alumno.carrera);
    const [plan, setPlan] = useState(alumno.plan);
    const [codigo, setCodigo] = useState(alumno.codigo);
    const [calidad, setCalidad] = useState(alumno.calidad);
    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
          alert('No se encontró el token de autenticación');
          return;
        }
        try{
            //Debemos hacer la llamada con todos los datos a actualizar. 
           const alumnoMesaUpdate = await fetch(`http://localhost:3000/api/mesas/update-alumno//${id_mesa}/${alumno.id_estudiante}`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inscripto, presente, carrera, plan, codigo, calidad }),
              });
        
              if (!alumnoMesaUpdate.ok) {
                throw new Error('Error al intentar modificar al alumno de la mesa');
              }
        }catch(error){
            setError(error.message);
        }

      };  
   
    return (
        <div>
          <h1>Crear Mesa de Examen</h1>
          <form onSubmit={handleSubmit} className="crear-mesa-form">
            <div className="form-group">
                <label htmlFor="inscripto">Inscripto</label>
                <select
                    id="inscripto"
                    value={inscripto ? "Si" : "No"} // Muestra "Si" si el valor es true, y "No" si es false
                    onChange={(e) => setInscripto(e.target.value === "Si")} // Convierte el texto seleccionado en un booleano
                    required
                >
                    <option value="Si">Si</option>
                    <option value="No">No</option>
                </select>
            </div>
            <div>
                <label htmlFor="presente">¿Presente?</label>
                <select
                    id="presente"
                    value={presente ? "Si" : "No"} // Convierte el booleano en una cadena
                    onChange={(e) => setPresente(e.target.value === "Si")} // Convierte la cadena en un booleano
                    required
                >
                    <option value="Si">Si</option>
                    <option value="No">No</option>
                </select>
                <p>Valor actual: {presente ? "Presente" : "Ausente"}</p>
            </div>
            <div className="form-group">
              <label htmlFor="carrera">Carrera: </label>
              <input
                type="text"
                id="carrera"
                value={carrera}
                onChange={(e) => setCarrera(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="plan">Plan: </label>
              <input
                type="text"
                id="plan"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="codigo">Código: </label>
              <input
                type="text"
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="calidad">Calidad: </label>
              <input
                type="text"
                id="calidad"
                value={calidad}
                onChange={(e) => setCalidad(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">Crear</button>
          </form>
          {error && <div className="error">{error}</div>}
        </div>
      );
};

export default AlumnoMesaUpdate;