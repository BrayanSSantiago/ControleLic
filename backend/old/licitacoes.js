import { defineEventHandler, sendError } from 'h3'
import { Op } from 'sequelize' // Importação do operador para consultas dinâmicas
import LicitacaoModel from '../../../backend/models/licitacoes.js' // Certifique-se de que o caminho está correto

export default defineEventHandler(async event => {
  try {
    // Extrai os parâmetros da requisição
    const query = getQuery(event)
    const { numero, tipo, objeto, estado } = query

    // Construção dinâmica dos filtros
    const where = {}
    if(numero){
      where.numero = { [Op.like]: `%${numero}%` } // Busca parcial pelo número
    }
    if(tipo){
      where.tipo = tipo // Filtro exato para o tipo
    }
    if(objeto){
      where.objeto = { [Op.like]: `%${objeto}%` } // Busca parcial pelo objeto
    }
    if(estado){
      where.local = { [Op.like]: `%/${estado}` } // Busca pelo estado no campo 'local'
    }

    // Consulta ao banco de dados com os filtros aplicados
    const licitacoes = await LicitacaoModel.findAll({ where })

    // Retorna as licitações filtradas
    return {
      success: true,
      data: licitacoes,
    }
  }
  catch (error){
    console.error('Erro ao buscar licitações:', error)
    return sendError(event, {
      statusCode: 500,
      message: 'Erro interno no servidor',
    })
  }
})
