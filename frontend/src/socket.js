import { io } from "socket.io-client";

// Conectar con el servidor WebSocket (ajusta la URL si es necesario)
const socket = io("https://proyectofinalariaskovach-production.up.railway.app/");

export default socket;
