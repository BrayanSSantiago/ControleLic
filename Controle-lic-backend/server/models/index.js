import Sequelize from 'sequelize'
import sequelize from '../config/database.js' // Verifique o caminho relativo

import favoritoModel from './favoritos.js'
import licitacoesModel from './licitacoes.js'
import userModel from './user.js'

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.User = userModel(sequelize, Sequelize)
db.Licitacoes = licitacoesModel(sequelize, Sequelize)
db.Favorito = favoritoModel(sequelize, Sequelize)

db.User.hasMany(db.Favorito, { as: 'favoritos', foreignKey: 'user_id' })
db.Favorito.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' })

db.Licitacoes.hasMany(db.Favorito, { as: 'favoritos', foreignKey: 'edital_id' })
db.Favorito.belongsTo(db.Licitacoes, { foreignKey: 'edital_id', as: 'edital' })

export default db
