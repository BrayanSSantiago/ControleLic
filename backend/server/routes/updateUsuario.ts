import bcrypt from 'bcryptjs'
import { readValidatedBody } from 'h3'
import { alterarContaParcial } from '~/utils/zod'

export default defineEventHandler(async event => {
  try {
    const body = await readValidatedBody(event, alterarContaParcial.safeParse)

    if(!body.success){
      throw createError({
        statusCode: 400,
        message: body.error.errors[0]?.message || 'Dados inválidos',
      })
    }

    const { id, usuario, email, senha, avatar, cargo } = body.data

    const user = await User.findByPk(id)

    if(!user){
      throw createError({ statusCode: 404, message: 'Usuário não encontrado' })
    }

    if(usuario) user.username = usuario
    if(email) user.email = email
    if(senha) user.password = await bcrypt.hash(senha, 10)
    if(avatar?.startsWith('data:image')){
      user.avatar = avatar
    }
    if(cargo) user.cargo = cargo

    await user.save()

    return {
      success: true,
      message: 'Usuário atualizado com sucesso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        cargo: user.cargo,
      },
    }
  }
  catch (error){
    console.error('Erro ao atualizar usuário:', error)
    return {
      success: false,
      message: error.message || 'Erro interno no servidor',
    }
  }
})
