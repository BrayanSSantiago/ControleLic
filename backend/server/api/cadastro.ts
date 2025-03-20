import { defineEventHandler, readBody } from "h3";
import { User } from "~/server/models"; // Ajuste para o caminho correto do modelo
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, email, password, confirmPassword } = body;

  // 🚨 Validação dos dados
  if (!username || !email || !password || !confirmPassword) {
    return { status: 400, message: "Todos os campos são obrigatórios!" };
  }

  if (password !== confirmPassword) {
    return { status: 400, message: "As senhas não coincidem!" };
  }

  // 🚨 Verificar se o email já existe no banco
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return { status: 400, message: "Este email já está cadastrado!" };
  }

  // 🔒 Hashear a senha antes de salvar no banco
  const hashedPassword = await bcrypt.hash(password, 10);

  // 🟢 Criar usuário no banco
  const newUser = await User.create({ username, email, password: hashedPassword });

  return { status: 201, message: "Usuário cadastrado com sucesso!", user: newUser };
});