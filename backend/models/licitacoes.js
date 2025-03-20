import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js' // ou o caminho correto para o arquivo de configuração do banco

const Licitacao = sequelize.define('Licitacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_pncp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dt_atl: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  local: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  orgao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  unidade_compradora: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  modalidade_contratacao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  amparo_legal: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  modo_disputa: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  registro_preco: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  data_divulgacao_pncp: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  situacao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fonte: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  data_inicio_recebimento_propostas: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  data_fim_recebimento_propostas: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  objeto: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  valorLicitacao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'licitacoes',
  timestamps: false,
})

export default Licitacao
