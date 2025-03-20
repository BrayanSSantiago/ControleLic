import sequelize from '~/server/config/database.js'
import UserModel from '~/server/models/user.js'

const User = UserModel(sequelize, sequelize.Sequelize.DataTypes)

export default defineEventHandler(async event => {
  try {
    // Obtém a sessão do usuário
    const session = await getUserSession(event)
    const { id } = session.user // O ID do usuário armazenado na sessão

    // Busca os dados do usuário no banco de dados
    const user = await User.findOne({
      where: { id }, // Certifique-se de que o campo de ID do modelo está correto
      attributes: ['username', 'email', 'avatar'], // Apenas os campos que você deseja retornar
    })

    // Verifica se o usuário foi encontrado
    if(!user){
      throw createError({ statusCode: 404, message: 'Usuário não encontrado' })
    }

    // Retorna os dados do usuário
    return {
      success: true,
      data: user,
    }
  }
  catch (error){
    // Lida com erros e passa a mensagem específica, se disponível
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Erro ao buscar informações do usuário',
    })
  }
})
