import { defineEventHandler, setResponseHeaders } from "h3";

export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Origin": "*", // Permite qualquer origem
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });

  // Se a requisição for OPTIONS (preflight), responde imediatamente
  if (event.node.req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }
});