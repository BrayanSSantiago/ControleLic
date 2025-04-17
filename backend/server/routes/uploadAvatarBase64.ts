export default defineEventHandler(async event => {
  const body = await readBody(event)

  const { id, avatar } = body

  if(!id){
    throw createError({ statusCode: 401, statusMessage: 'Usuário não autenticado.' })
  }
  if(!avatar || !avatar.startsWith('data:image')){
    throw createError({ statusCode: 400, message: 'Formato inválido de imagem base64' })
  }

  try {
    const user = await User.findByPk(id)

    if(!user){
      throw createError({ statusCode: 404, message: 'Usuário não encontrado' })
    }

    user.avatar = avatar
    await user.save()

    return {
      success: true,
      message: 'Avatar atualizado com sucesso',
      avatar: user.avatar,
    }
  }
  catch (error){
    console.error('Erro ao atualizar avatar:', error)
    throw createError({ statusCode: 500, message: 'Erro ao salvar o avatar' })
  }
})
