import jwt from 'jsonwebtoken'

export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, AuthSchema.safeParse)

  if(!body.success) throw createError({ status: 401, message: body?.error?.errors?.[0]?.message || '' })

  const { usuario, senha } = body.data

  const user = await User.findOne({ where: { username: usuario } })
  if(!user) throw createError({ status: 400, message: 'Usuário e/ou senha incorretos' })

  const senhaValida = true // valida a senha aqui nesse caralho

  if(!senhaValida) throw createError({ status: 400, message: 'Usuário e/ou senha incorretos' })

  const token = jwt.sign({ usuario }, jwtPassword)

  return token
})
