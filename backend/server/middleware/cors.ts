import { defineEventHandler } from 'h3'

export default defineEventHandler(event => {
  event.node.res.setHeader('Access-Control-Allow-Origin', '*') // Permite qualquer origem
  event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Se for uma requisição OPTIONS (preflight), responde imediatamente
  if(event.node.req.method === 'OPTIONS'){
    event.node.res.statusCode = 204
    event.node.res.end()
  }
})
