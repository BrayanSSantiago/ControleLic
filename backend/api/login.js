import 'h3'
import { z } from 'zod'
import sequelize from '~/server/config/database.js'
import UserModel from '~/server/models/user.js'

const User = UserModel(sequelize, sequelize.Sequelize.DataTypes)

// Defina o esquema de validação usando zod
const loginSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  password: z.string().min(1, 'Password é obrigatório'),
})

export default defineEventHandler(async event => {
  try {
    // Leia e valide o corpo da requisição
    const body = await readBody(event)
    const result = loginSchema.safeParse(body)

    if(!result.success){
      // Se a validação falhar, lança um erro 400 com detalhes
      throw createError({
        statusCode: 400,
        message: 'Validation Error',
        details: result.error.errors,
      })
    }

    const { username, password } = result.data

    // Autentique o usuário
    const user = await User.findOne({ where: { username, password } })

    if(!user){
      return {
        success: false,
        message: 'Credenciais inválidas',
      }
    }

    const loginTime = Date.now() / 1000 // Timestamp atual em segundos

    // Armazene o username e loginTime na sessão
    await setUserSession(event, { user: { id: user.id, username: user.username, avatar: user.avatar } })

    // Retorne uma resposta de sucesso com o timestamp de login
    return {
      success: true,
      message: 'Autenticado com sucesso!',
      loginTime, // Retorna o timestamp do login
    }
  }
  catch (error){
    console.error('Erro ao tentar fazer login:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro interno no servidor',
      details: error.details || null,
    })
  }
})
