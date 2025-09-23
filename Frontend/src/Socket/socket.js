import { io } from "socket.io-client";

const BackendURL = import.meta.env.VITE_backendURL;
const socket = io(BackendURL);

export default socket;
