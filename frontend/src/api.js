import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-asistenciauns-r8y7sf6v0-coachvachs-projects.vercel.app', 
});

export default api;
