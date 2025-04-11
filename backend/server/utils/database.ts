import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('techfund', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
})

export default sequelize
