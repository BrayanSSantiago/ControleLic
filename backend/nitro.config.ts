import corsMiddleware from './server/middleware/cors' // Importa o middleware de CORS

export default defineNitroConfig({
  srcDir: 'server',
  compatibilityDate: '2025-03-20',
  devHandlers: [
    {
      handler: corsMiddleware, // Agora usamos a importação direta
    },
  ],
})
