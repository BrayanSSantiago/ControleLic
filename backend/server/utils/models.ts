import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'

export const Edital = database.define('Edital', {
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

export const Favorito = database.define('Favorito', {
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

export const Licitacao = database.define('Licitacao', {
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

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>{
  declare id: number

  declare username: string

  declare password: string

  declare email: string

  declare avatar?: string
}

User.init({
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
  password: { // 🔹 Agora está corretamente tipado
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize: database,
  tableName: 'usuarios',
  timestamps: false,
})
