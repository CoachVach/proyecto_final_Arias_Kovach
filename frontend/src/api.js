import axios from 'axios';

const api = axios.create({
  baseURL: 'https://proyectofinalariaskovach-production.up.railway.app', 
});

export default api;
