import { io } from "socket.io-client";

// Conectar con el servidor WebSocket (ajusta la URL si es necesario)
const socket = io("https://backend-asistenciauns-r8y7sf6v0-coachvachs-projects.vercel.app");

export default socket;
