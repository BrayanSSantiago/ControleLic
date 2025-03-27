import { Op, WhereOptions } from 'sequelize'

interface QueryParams{
  numero?: string,
  tipo?: string,
  objeto?: string,
  estado?: string,
  page?: string,
  limit?: string,
  dataInicio?: string,
  dataFim?: string,
  orgao?: string,
  modalidade_contratacao?: string,
  unidade_compradora?: string,
  amparo_legal?: string,
  modo_disputa?: string,
  situacao?: string,
  fonte?: string,
}

export default defineEventHandler(async event => {
  const query = getQuery(event) as QueryParams

  const {
    numero,
    tipo,
    objeto,
    estado,
    dataInicio,
    dataFim,
    page = '1',
    limit = '10',
    ...filtrosDinamicos
  } = query

  const where: WhereOptions = {}

  if(numero) where.numero = { [Op.like]: `%${numero}%` }
  if(tipo) where.tipo = tipo
  if(objeto) where.objeto = { [Op.like]: `%${objeto}%` }
  if(estado) where.local = { [Op.like]: `%/${estado}` }
  if(dataInicio) where.data_inicio_recebimento_propostas = { [Op.gte]: dataInicio }
  if(dataFim) where.data_fim_recebimento_propostas = { [Op.lte]: dataFim }

  // Campos dinâmicos extras
  const camposExtras = [
    'orgao',
    'modalidade_contratacao',
    'unidade_compradora',
    'amparo_legal',
    'modo_disputa',
    'situacao',
    'fonte',
  ] as const

  for(const campo of camposExtras){
    const valor = filtrosDinamicos[campo]
    if(valor){
      where[campo] = valor
    }
  }

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
