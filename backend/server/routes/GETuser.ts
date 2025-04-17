export default defineEventHandler(async () => {
  try {
    const usuarios = await User.findAll({
      attributes: ['id', 'username', 'email', 'cargo'], // não retorna senha!
      order: [['id', 'ASC']],
    })

    return {
      success: true,
      data: usuarios,
    }
  }
  catch (error){
    console.error('Erro ao buscar usuários:', error)
    return {
      success: false,
      message: 'Erro ao buscar usuários',
    }
  }
})
