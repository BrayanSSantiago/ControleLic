export default defineEventHandler(async event => {
  const { user_id } = await readBody(event)

  try {
    const favoritos = await Favorito.findAll({
      where: { user_id },
      include: [{ model: Licitacao }],
    })

    const licitacoes = favoritos.map(fav => fav.licitacao_id)

    return { success: true, data: licitacoes }
  }
  catch (error){
    console.error(error)
    throw createError({ statusCode: 500, message: 'Erro ao buscar favoritos' })
  }
})
