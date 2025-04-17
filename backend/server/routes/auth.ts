import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, AuthSchema.safeParse)

  if(!body.success) throw createError({
    status: 401,
    message: body?.error?.errors?.[0]?.message || '',
  })

  const { usuario, senha } = body.data

  const user = await User.findOne({ where: { username: usuario } })

  if(!user){
    throw createError({ status: 400, message: 'Usuário e/ou senha incorretos' })
  }

  const senhaValida = await bcrypt.compare(senha, user.password)
  if(!senhaValida){
    throw createError({ status: 400, message: 'Usuário e/ou senha incorretos' })
  }

  const token = jwt.sign({ usuario: user.username, id: user.id, avatar: user.avatar, email: user.email, cargo: user.cargo }, jwtPassword, { expiresIn: '1h' })

  return {
    message: 'Login realizado com sucesso!',
    token,
    usuario: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      cargo: user.cargo,
    },
  }
})
