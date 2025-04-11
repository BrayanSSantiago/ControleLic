import bcrypt from 'bcryptjs'
import { alterarContaParcial } from '~/utils/zod'

export default defineEventHandler(async event => {
  try {
    const body = await readValidatedBody(event, alterarContaParcial.safeParse)

    if(!body.success) throw createError({
      status: 401,
      message: body?.error?.errors?.[0]?.message || '',
    })

    const { id, usuario, email, senha } = body.data

    const user = await User.findByPk(id)

    if(usuario) user.username = usuario
    if(email) user.email = email
    if(senha) user.password = senha // aplique hash aqui se necessário

    const senhaEncrypt = bcrypt.hash(user.password, 10)

    await user.save()

    return {
      success: true,
      message: 'Usuário atualizado com sucesso',
      user: {
        id: user.id,
        username: user.username,
        password: senhaEncrypt,
        email: user.email,
      },
    }
  }
  catch (error){
    console.error(error)
    return { success: false, message: 'Erro ao atualizar o usuário' }
  }
})
