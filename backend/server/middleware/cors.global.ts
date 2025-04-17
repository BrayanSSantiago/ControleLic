// server/middleware/cors.global.ts
export default defineEventHandler(event => {
  // Libera CORS para todas as origens e métodos
  setHeader(event, 'Access-Control-Allow-Origin', 'https://techfund.net.br')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Responde diretamente a requisições OPTIONS (preflight)
  if(getMethod(event) === 'OPTIONS'){
    event.node.res.statusCode = 204
    return null
  }
})
