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

export class Favorito extends Model<
  InferAttributes<Favorito>,
  InferCreationAttributes<Favorito>
>{
  declare id: number

  declare user_id: number

  declare licitacao_id: number

  declare Licitacao?: Licitacao
}

Favorito.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id',
    },
  },
  licitacao_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'licitacoes',
      key: 'id',
    },
  },
}, {
  sequelize: database,
  tableName: 'favoritos', // ← Nome da tabela no banco
  timestamps: false, // Ative se sua tabela tiver createdAt/updatedAt
})

export class Licitacao extends Model<InferAttributes<Licitacao>, InferCreationAttributes<Licitacao>>{
  declare id: number

  declare id_pncp: string

  declare dt_atl: Date | null

  declare link: string

  declare numero: null | string

  declare local: null | string

  declare orgao: null | string

  declare unidade_compradora: null | string

  declare modalidade_contratacao: null | string

  declare amparo_legal: null | string

  declare tipo: null | string

  declare modo_disputa: null | string

  declare registro_preco: null | string

  declare data_divulgacao_pncp: Date | null

  declare situacao: null | string

  declare fonte: null | string

  declare data_inicio_recebimento_propostas: Date | null

  declare data_fim_recebimento_propostas: Date | null

  declare objeto: null | string

  declare valorLicitacao: null | string
}
Licitacao.init({
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
  sequelize: database,
  tableName: 'licitacoes',
  timestamps: false,
})

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>{
  declare id: number

  declare username: string

  declare password: string

  declare email: string

  declare avatar?: string

  declare cargo?: string
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
  cargo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize: database,
  tableName: 'usuarios',
  timestamps: false,
})

// Relacionamentos entre as tabelas
User.hasMany(Favorito, { foreignKey: 'user_id' })
Favorito.belongsTo(User, { foreignKey: 'user_id' })

Licitacao.hasMany(Favorito, { foreignKey: 'licitacao_id' })
Favorito.belongsTo(Licitacao, { foreignKey: 'licitacao_id' })
