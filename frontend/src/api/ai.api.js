import api from "./axios";

export const chatWithAssistant = (message) =>
  api.post("/ai/chat", {
    message,
  });
