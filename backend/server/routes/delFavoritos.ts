export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { user_id, licitacao_id } = body as { user_id?: number, licitacao_id?: number }

  if(!user_id || !licitacao_id){
    throw createError({ statusCode: 400, message: 'Parâmetros obrigatórios ausentes' })
  }

  try {
    const deleted = await Favorito.destroy({
      where: { user_id, licitacao_id },
    })

    if(!deleted){
      throw createError({ statusCode: 404, message: 'Favorito não encontrado' })
    }

    return { success: true, message: 'Favorito removido com sucesso' }
  }
  catch (error){
    console.error(error)
    throw createError({ statusCode: 500, message: 'Erro ao remover favorito' })
  }
})
