import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('techfundNOVO', 'root', 'L3v0am04#!', {
  host: 'localhost',
  dialect: 'mysql',
})

export default sequelize
