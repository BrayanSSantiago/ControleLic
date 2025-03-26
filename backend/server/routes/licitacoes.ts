import { Op, WhereOptions } from 'sequelize'

interface QueryParams{
  numero?: string,
  tipo?: string,
  objeto?: string,
  estado?: string,
  page?: string,
  limit?: string,
  dataInicio?: Date,
  dataFim?: Date,
}

export default defineEventHandler(async event => {
  const query = getQuery(event) as QueryParams
  const { numero, tipo, objeto, estado, dataInicio, dataFim, page = '1', limit } = query

  const where: WhereOptions = {}
  if(numero) where.numero = { [Op.like]: `%${numero}%` }
  if(tipo) where.tipo = tipo
  if(objeto) where.objeto = { [Op.like]: `%${objeto}%` }
  if(estado) where.local = { [Op.like]: `%/${estado}` }
  if(dataInicio) where.data_inicio_recebimento_propostas = { [Op.like]: `%/${dataInicio}` }
  if(dataFim) where.data_fim_recebimento_propostas = { [Op.like]: `%/${dataFim}` }

  const pageNumber = Number.parseInt(page)
  const limitNumber = Number.parseInt(limit)
  const offset = (pageNumber - 1) * limitNumber

  try {
    const [licitacoes, total] = await Promise.all([
      Licitacao.findAll({ where, offset, limit: limitNumber }),
      Licitacao.count({ where }),
    ])

    return {
      success: true,
      data: licitacoes,
      pagination: {
        page: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        total,
      },
    }
  }
  catch (error){
    console.error('Erro ao buscar licitações:', error)
    throw createError({ status: 500, message: 'Erro ao buscar licitações' })
  }
})
