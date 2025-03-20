import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const Favorito = sequelize.define('Favorito', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios', // Nome da tabela de usuários
      key: 'id',
    },
  },
  licitacao_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'licitacoes', // Nome da tabela de licitações
      key: 'id',
    },
  },
}, {
  tableName: 'favoritos', // Especifica o nome da tabela aqui
  timestamps: false, // Se você não está usando colunas de timestamp como createdAt e updatedAt
})

export default Favorito
