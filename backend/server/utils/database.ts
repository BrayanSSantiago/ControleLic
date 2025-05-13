import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('techfundnovo', 'root', '', {
  host: '192.168.1.1',
  dialect: 'mysql',
})

export default sequelize
