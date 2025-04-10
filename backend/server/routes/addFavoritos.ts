export default defineEventHandler(async event => {
  const body = await readBody<{ user_id?: number, licitacao_id?: number }>(event)
  const { user_id, licitacao_id } = body
  // Em addFavoritos.post.ts

  if(!user_id || !licitacao_id){
    throw createError({ statusCode: 400, message: 'Parâmetros ausentes' })
  }

  try {
    const [favorito, created] = await Favorito.findOrCreate({
      where: { user_id, licitacao_id },
    })

    if(!created){
      throw createError({ statusCode: 409, message: 'Favorito já existe' })
    }

    return {
      success: true,
      message: 'Favorito adicionado com sucesso',
      favorito,
    }
  }
  catch (error){
    console.error(error)
    throw createError({ statusCode: 500, message: 'Erro ao adicionar favorito' })
  }
})
