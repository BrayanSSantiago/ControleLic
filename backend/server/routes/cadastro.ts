import bcrypt from 'bcryptjs'

export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, UsuarioSchema.safeParse)

  if(!body.success) throw createError({ status: 401, message: body?.error?.errors?.[0]?.message || '' })

  const { usuario, email, senha } = body.data

  const existingUser = await User.findOne({ where: { email } })
  if(existingUser) throw createError({ status: 400, message: 'Este email já está cadastrado!' })

  const hashedPassword = await bcrypt.hash(senha, 10)

  await User.create({ username: usuario, email, password: hashedPassword })
    .catch(error => {
      console.error(`Ocorreu um erro ao cadastrar o usuario no banco de dados ${error}`)
      throw createError({ status: 500, message: 'Não foi possivel cadastrar o usuario' })
    })

  return { message: 'Usuário cadastrado com sucesso!' }
})
