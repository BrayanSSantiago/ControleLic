import { Op } from 'sequelize'

export default defineEventHandler(async () => {
  const campos = [
    'orgao',
    'modalidade_contratacao',
    'unidade_compradora',
    'amparo_legal',
    'modo_disputa',
    'situacao',
    'fonte',
  ] as const

  type Campo = typeof campos[number]

  try {
    const resultados = await Promise.all(campos.map(async (campo: Campo) => {
      const dados = await Licitacao.findAll({
        attributes: [[campo, campo]],
        group: [campo],
        where: {
          [campo]: { [Op.ne]: null },
        },
        order: [[campo, 'ASC']],
      })

      return {
        [campo]: dados.map(d => d.getDataValue(campo) as string),
      }
    }))

    // Combina todos os resultados em um único objeto
    const data = Object.assign({}, ...resultados)

    return { success: true, data }
  }
  catch (error){
    console.error('Erro ao carregar filtros dinâmicos:', error)
    throw createError({ status: 500, message: 'Erro ao carregar filtros' })
  }
})
