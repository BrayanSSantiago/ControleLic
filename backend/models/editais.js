import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js' // Assumindo que esse arquivo contém a configuração e a instância do Sequelize

const Edital = sequelize.define('Edital', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  instituicao_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dt_atl: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Editais',
  timestamps: false,
})

export default Edital
