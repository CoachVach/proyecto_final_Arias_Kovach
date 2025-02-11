import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-asistenciauns.vercel.app/', 
});

export default api;
