import { readMultipartFormData } from 'h3'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import sequelize from '~/server/config/database.js'
import UserModel from '~/server/models/user.js'

const User = UserModel(sequelize, sequelize.Sequelize.DataTypes)

// Configuração do diretório de uploads
const uploadDir = path.resolve('public/uploads')

export default defineEventHandler(async event => {
  // Obter a sessão do usuário
  const session = await getUserSession(event)
  const { id } = session.user

  try {
    // Ler os dados multipart do formulário
    const form = await readMultipartFormData(event)
    const avatarFile = form.find(field => field.name === 'avatar')

    if(!avatarFile){
      throw createError({ statusCode: 400, statusMessage: 'Arquivo de avatar não encontrado.' })
    }

    // Criar o diretório de uploads se não existir
    await fs.mkdir(uploadDir, { recursive: true })

    // Salvar o arquivo de avatar
    const fileName = `${Date.now()}_${avatarFile.filename}`
    const filePath = path.join(uploadDir, fileName)

    await fs.writeFile(filePath, avatarFile.data)

    // Atualizar o caminho da imagem de perfil no banco de dados usando Sequelize
    const usuario = await User.findByPk(id)
    if(!usuario){
      throw createError({ statusCode: 404, statusMessage: 'Usuário não encontrado.' })
    }

    // Atualizar o campo avatar no banco de dados
    // Atualizar o campo avatar no banco de dados
    usuario.avatar = `/uploads/${fileName}`
    console.log('Caminho do Avatar:', usuario.avatar)
    console.log('ID do Usuário:', usuario.id)

    await usuario.save()

    // Responder com sucesso e o caminho da imagem
    return {
      success: true,
      filePath: usuario.avatar,
    }
  }
  catch (error){
    return {
      success: false,
      message: error.message || 'Erro ao fazer upload do avatar.',
    }
  }
})
