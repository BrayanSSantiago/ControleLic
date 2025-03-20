import { readMultipartFormData } from 'h3'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import sequelize from '~/server/config/database.js'
import UserModel from '~/server/models/user.js'

const User = UserModel(sequelize, sequelize.Sequelize.DataTypes)

// Configuração do diretório de uploads
const uploadDir = path.resolve('public/uploads')

// Definir um tamanho máximo para o arquivo (ex.: 5 MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export default defineEventHandler(async event => {
  // Obter a sessão do usuário

  const { user } = await getUserSession(event)

  try {
    // Ler os dados multipart do formulário
    const form = await readMultipartFormData(event)

    // Verificar se o campo "avatar" existe no formulário
    const avatarFile = form.find(field => field.name === 'avatar')
    const Email = form.find(field => field.name === 'email')?.data.toString()
    const nome = form.find(field => field.name === 'username')?.data.toString()
    const senha = form.find(field => field.name === 'password')?.data.toString()

    // Verificar se os valores estão corretos

    // Criar o diretório de uploads se não existir
    await fs.mkdir(uploadDir, { recursive: true })

    let filePath = null

    if(avatarFile){
      // Verificar tipo de arquivo (somente imagens permitidas)
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
      if(!validMimeTypes.includes(avatarFile.type)){
        throw createError({ statusCode: 400, statusMessage: 'Tipo de arquivo inválido. Apenas JPEG, PNG e GIF são permitidos.' })
      }

      // Verificar o tamanho do arquivo
      if(avatarFile.size > MAX_FILE_SIZE){
        throw createError({ statusCode: 400, statusMessage: 'O tamanho do arquivo excede o limite de 5 MB.' })
      }

      // Salvar o arquivo de avatar com um nome único
      const fileName = `${Date.now()}_${path.basename(avatarFile.filename)}`
      filePath = path.join(uploadDir, fileName)

      // Gravar o arquivo no sistema
      await fs.writeFile(filePath, avatarFile.data)
      filePath = `/uploads/${fileName}` // Caminho relativo a ser salvo no banco
    }

    // Atualizar o banco de dados
    const usuario = await User.findByPk(user.id)
    if(!usuario){
      throw createError({ statusCode: 404, statusMessage: 'Usuário não encontrado.' })
    }

    // Atualizar os campos do usuário no banco de dados
    if(filePath){
      usuario.avatar = filePath
    }
    if(Email && Email !== usuario.email){
      usuario.email = Email
    }
    if(nome && nome !== usuario.username){
      usuario.username = nome
    }
    if(senha){
      usuario.password = senha // Armazenando a senha como texto claro, intencionalmente
    }

    await usuario.save()
    await replaceUserSession(event, { user: { id: user.id, username: nome, email: Email, avatar: filePath } })

    // Responder com sucesso e o caminho da imagem, se houver
    return {
      success: true,
      filePath: usuario.avatar,
    }
  }
  catch (error){
    console.error('Erro ao atualizar perfil:', error)
    return {
      success: false,
      message: error.message || 'Erro ao atualizar perfil.',
    }
  }
})
