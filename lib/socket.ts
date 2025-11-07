import { io, Socket } from "socket.io-client";

// Backend WebSocket URL
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket server");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket server");
    });

    socket.on("connection_response", (data) => {
      console.log("WebSocket:", data);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
