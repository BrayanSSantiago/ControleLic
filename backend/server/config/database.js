import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('techfund', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
})

export default sequelize // Corrigido para exportar o sequelize como padrão
