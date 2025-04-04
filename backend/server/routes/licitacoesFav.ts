export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { user_id } = body

  if(!user_id){
    throw createError({
      statusCode: 400,
      message: 'Parâmetro "user_id" é obrigatório',
    })
  }

  try {
    const favoritos = await Favorito.findAll({
      where: { user_id },
      include: [{ model: Licitacao }], // ← funciona porque o relacionamento está feito
    })

    const licitacoes = favoritos
      .map(fav => fav.Licitacao)
      .filter(Boolean)

    console.log('Favoritos:', JSON.stringify(favoritos, null, 2))

    return {
      success: true,
      data: licitacoes,
    }
  }
  catch (error){
    console.error('Erro ao buscar favoritos:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao buscar favoritos do usuário',
    })
  }
})
