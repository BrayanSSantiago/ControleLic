import { createError, defineEventHandler } from 'h3'
import FavoritoModel from '~/server/models/favoritos.js'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { licitacao_id } = body
  const session = await getUserSession(event) // Função que obtém a sessão do usuário
  const { id: user_id } = session.user // Obtemos o id do usuário a partir da sessão

  // Verificar se o licitacao_id foi fornecido
  if(!licitacao_id){
    throw createError({ statusCode: 400, message: 'licitacao_id não fornecido' })
  }

  try {
    // Destruir a entrada da tabela de favoritos com base no user_id e licitacao_id
    const rowsDeleted = await FavoritoModel.destroy({
      where: { user_id, licitacao_id },
    })

    // Verificar se algum registro foi removido
    if(rowsDeleted){
      return { message: 'Favorito removido com sucesso' }
    }
    throw createError({ statusCode: 404, message: 'Favorito não encontrado' })
  }
  catch (error){
    // Capturar e exibir qualquer erro que ocorra
    console.error('Erro ao remover favorito:', error)
    throw createError({ statusCode: 500, message: 'Erro ao remover favorito' })
  }
})
