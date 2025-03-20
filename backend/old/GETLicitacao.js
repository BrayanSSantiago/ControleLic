import { createError, defineEventHandler } from 'h3'
import FavoritoModel from '~/server/models/favoritos.js'

export default defineEventHandler(async event => {
  try {
    // Obtém a sessão do usuário (lembre-se de usar await)
    const session = await getUserSession(event)
    const { id } = session.user

    // Busca todos os favoritos do usuário
    const favoritos = await FavoritoModel.findAll({
      where: { user_id: id }, // Certifique-se de que o campo user_id está correto
      attributes: ['licitacao_id'],
    })

    // Extrai os IDs dos editais dos favoritos
    const editalIds = favoritos.map(favorito => favorito.licitacao_id)

    // Retorna a lista de IDs dos editais
    return editalIds
  }
  catch (error){
    // Lida com erros e passa a mensagem específica, se disponível
    throw createError({ statusCode: error.statusCode || 500, message: error.message || 'Erro ao buscar favoritos' })
  }
})
