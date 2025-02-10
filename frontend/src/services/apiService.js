const API_BASE_URL = 'http://localhost:3000/api';

// Función para hacer peticiones a la API con autenticación
const fetchWithAuth = async (url, options = {}) => {
  
  const token = localStorage.getItem('token');
  console.log(token);
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error: ${response.status} - ${errorText}`);
  }

  return response.json();
};

// Obtener los datos del usuario
export const getUserData = async () => {
  try {
    const data = await fetchWithAuth('/profesores');
    return data;
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw new Error('No se pudieron obtener los datos del usuario.');
  }
};

// Actualizar los datos del usuario
export const updateUserData = async (data) => {
  try {
    const updatedUser = await fetchWithAuth('/profesores', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return updatedUser;
  } catch (error) {
    console.error('Error al actualizar los datos del usuario:', error);
    throw new Error('No se pudieron actualizar los datos del usuario.');
  }
};

// Obtener todas las mesas de examen para un profesor
export const getAllMesas = async () => {
  try {
    const mesas = await fetchWithAuth('/mesas/profesor');
    return mesas;
  } catch (error) {
    console.error('Error al obtener las mesas:', error);
    throw new Error('No se pudieron obtener las mesas de examen.');
  }
};


// Obtener todas las mesas de examen para un colaborador
export const getAllMesasByColaborador = async () => {
  try {
    const mesas = await fetchWithAuth('/mesas/colaborador');
    return mesas;
  } catch (error) {
    console.error('Error al obtener las mesas:', error);
    throw new Error('No se pudieron obtener las mesas de examen.');
  }
};

// Obtener detalles de una mesa de examen específica
export const getMesaDetails = async (mesaId) => {
  try {
    const mesaDetails = await fetchWithAuth(`/mesas/${mesaId}`);
    return mesaDetails;
  } catch (error) {
    console.error(`Error al obtener los detalles de la mesa ${mesaId}:`, error);
    throw new Error('No se pudieron obtener los detalles de la mesa.');
  }
};

// Eliminar una mesa de examen
export const deleteMesa = async (mesaId) => {
  try {
    await fetchWithAuth(`/mesas/${mesaId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`Error al eliminar la mesa ${mesaId}:`, error);
    throw new Error('No se pudo eliminar la mesa.');
  }
};

// Crear una nueva mesa de examen
export const createMesa = async (data) => {
  try {
    const nuevaMesa = await fetchWithAuth('/mesas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return nuevaMesa;
  } catch (error) {
    console.error('Error al crear la mesa:', error);
    throw new Error('No se pudo crear la mesa de examen.');
  }
};

// Obtener los alumnos de una mesa de examen específica
export const getAlumnos = async (mesaID) => {
  try {
    const alumnos = await fetchWithAuth(`/alumnos/mesa/${mesaID}`);
    return alumnos;
  } catch (error) {
    console.error(`Error al obtener los alumnos para la mesa ${mesaID}:`, error);
    throw new Error('No se pudieron obtener los alumnos de la mesa.');
  }
};

// Actualizar la información de un alumno en una mesa de examen
export const updateAlumno = async (mesaID, alumnoID, data) => {
  try {
    const alumnoActualizado = await fetchWithAuth(`/mesas/${mesaID}/${alumnoID}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return alumnoActualizado;
  } catch (error) {
    console.error(`Error al actualizar el alumno ${alumnoID} para la mesa ${mesaID}:`, error);
    throw new Error('No se pudo actualizar la información del alumno.');
  }
};

// Crear un nuevo alumno en la base de datos
export const createAlumno = async (data) => {
  try {
    const nuevoAlumno = await fetchWithAuth('/alumnos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return nuevoAlumno;
  } catch (error) {
    console.error('Error al crear el alumno:', error);
    throw new Error('No se pudo crear el alumno.');
  }
};

// Actualizar la información de una mesa de examen
export const updateMesa = async (mesaId, data) => {
  try {
    const mesaActualizada = await fetchWithAuth(`/mesas/${mesaId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return mesaActualizada;
  } catch (error) {
    console.error(`Error al actualizar la mesa ${mesaId}:`, error);
    throw new Error('No se pudo actualizar la mesa de examen.');
  }
};
  // Actualizar las notas de una mesa de examen
export const  updateNotasMesa = async (mesaId, dataNotas) => {
  try {
    const mesaActualizada = await fetchWithAuth(`/mesas/notas/${mesaId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({notasById: dataNotas}),
    });
    return mesaActualizada;
  } catch (error) {
    console.error(`Error al actualizar la mesaddddddd ${mesaId}:`, error);
    throw new Error('No se pudo actualizar la mesa de examen.');
  }
};
