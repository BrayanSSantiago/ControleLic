import { Op, WhereOptions } from 'sequelize'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { user_id, ...filtros } = body

  if(!user_id){
    throw createError({ statusCode: 400, message: 'user_id é obrigatório' })
  }

  const where: WhereOptions = {}

  // Filtros básicos
  if(filtros.objeto){
    where.objeto = { [Op.like]: `%${filtros.objeto}%` }
  }

  if(filtros.estado){
    where.local = { [Op.like]: `%/${filtros.estado}` }
  }

  if(filtros.tipo){
    where.tipo = filtros.tipo
  }

  if(filtros.dataInicio){
    where.data_inicio_recebimento_propostas = { [Op.gte]: filtros.dataInicio }
  }

  if(filtros.dataFim){
    where.data_fim_recebimento_propostas = { [Op.lte]: filtros.dataFim }
  }

  // Aplica os filtros na busca dos favoritos do usuário
  const favoritos = await Favorito.findAll({
    where: { user_id },
    include: [{
      model: Licitacao,
      where, // APLICA OS FILTROS NA LICITAÇÃO
    }],
  })

  // Mapeia os dados
  const licitacoes = favoritos.map(fav => fav.Licitacao).filter(Boolean)

  return {
    success: true,
    data: licitacoes,
  }
})
