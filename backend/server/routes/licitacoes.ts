import { Op, WhereOptions } from 'sequelize'

interface QueryParams{
  numero?: string,
  tipo?: string,
  objeto?: string,
  estado?: string,
}

export default defineEventHandler(async event => {
  const query = getQuery(event) as QueryParams
  const { numero, tipo, objeto, estado } = query

  const where: WhereOptions = {}

  if(numero){
    where.numero = { [Op.like]: `%${numero}%` }
  }
  if(tipo){
    where.tipo = tipo
  }
  if(objeto){
    where.objeto = { [Op.like]: `%${objeto}%` }
  }
  if(estado){
    where.local = { [Op.like]: `%/${estado}` }
  }

  const licitacoes = await Licitacao.findAll({ where })
    .catch(error => {
      console.error(`Ocorreu um erro ao tentar baixar as licitações do banco de dados ${error}`)
      throw createError({ status: 500, message: 'Não foi possivel baixar as licitações' })
    })

  return {
    success: true,
    data: licitacoes,
  }
})
