//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  compatibilityDate: "2025-03-20",
  plugins: ["~/server/middleware/cors.ts"], // Caminho correto para o middleware

});