import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export const createSocket = (token) => {
  return io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
  });
};

export const socketEvents = {
  // Connection events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ERROR: "error",

  // Project events
  JOIN_PROJECT: "join-project",
  USER_JOINED: "user-joined",
  USER_LEFT: "user-left",

  // Code collaboration events
  CODE_UPDATE: "code-update",
  CODE_CHANGE: "code-change",
  CURSOR_POSITION: "cursor-position",

  // Chat events
  SEND_MESSAGE: "send-message",
  NEW_MESSAGE: "new-message",
  TYPING_START: "typing-start",  // ✅ unified
  TYPING_STOP: "typing-stop",    // ✅ unified
};
