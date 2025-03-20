import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const jwtSecret = jwtPassword

export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, AuthSchema.safeParse)

  if(!body.success) throw createError({ status: 401, message: body?.error?.errors?.[0]?.message || '' })

  const { usuario, senha } = body.data

  // 🔹 Verifica se o usuário existe no banco de dados
  const user = await User.findOne({ where: { username: usuario } })
  if(!user){
    throw createError({ status: 400, message: 'Usuário e/ou senha incorretos' })
  }

  // 🔹 Valida a senha com bcrypt
  const senhaValida = await bcrypt.compare(senha, user.password)
  if(!senhaValida){
    throw createError({ status: 400, message: 'Usuário e/ou senha incorretos' })
  }

  // 🔹 Gera um token JWT com expiração de 1h
  const token = jwt.sign({ usuario: user.username, id: user.id }, jwtSecret, { expiresIn: '1h' })

  return {
    message: 'Login realizado com sucesso!',
    token,
  }
})
