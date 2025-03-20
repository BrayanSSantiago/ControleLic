import FavoritoModel from '~/server/models/favoritos.js' // Certifique-se de que o caminho está correto

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { licitacao_id } = body
  const session = await getUserSession(event) // Supondo que você tenha uma função para obter a sessão
  const { id: user_id } = session.user

  try {
    const [favorito, created] = await FavoritoModel.findOrCreate({
      where: { user_id, licitacao_id },
    })

    if(created){
      return { message: 'Favorito adicionado com sucesso', favorito }
    }
    throw createError({ statusCode: 409, message: 'Esse edital já está nos seus favoritos' })
  }
  catch {
    throw createError({ statusCode: 500, message: 'Erro ao adicionar favorito' })
  }
})
