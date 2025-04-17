export default defineEventHandler(async event => {
  try {
    const body = await readBody<{ id?: number }>(event)

    if(!body.id || Number.isNaN(body.id)){
      throw createError({ statusCode: 400, message: 'ID inválido' })
    }

    const usuario = await User.findByPk(body.id)

    if(!usuario){
      throw createError({ statusCode: 404, message: 'Usuário não encontrado' })
    }

    await usuario.destroy()

    return {
      success: true,
      message: 'Usuário deletado com sucesso',
    }
  }
  catch (error){
    console.error('Erro ao deletar usuário:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao deletar usuário',
    })
  }
})
