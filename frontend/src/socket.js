import { io } from "socket.io-client";

// Conectar con el servidor WebSocket (ajusta la URL si es necesario)
const socket = io("http://localhost:3000");

export default socket;
