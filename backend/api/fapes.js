import { defineEventHandler, sendError } from 'h3'
import Edital from '../models/editais' // Certifique-se de que o caminho está correto

export default defineEventHandler(async event => {
  try {
    // Busca todas as licitações no banco de dados
    const editais = await Edital.findAll()

    // Retorna as licitações em formato JSON
    return {
      success: true,
      data: editais,
    }
  }
  catch (error){
    console.error('Erro ao buscar EditaisFapes:', error)
    sendError(event, {
      statusCode: 500,
      message: 'Erro interno no servidor',
    })
  }
})
