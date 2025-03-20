export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    avatar: { // Nome em minúsculo para consistência
      type: DataTypes.STRING,
      allowNull: true, // Se você deseja que o avatar seja opcional
    },
  }, {
    tableName: 'usuarios', // Nome da tabela no banco de dados
    timestamps: false, // Se você não está usando colunas de timestamp como createdAt e updatedAt
  })

  return User
}
