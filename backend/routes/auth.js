import express from "express";
import bcrypt from "bcrypt"; // Para hashear senhas
import User from "../models/user.js"; // Importa o modelo de usuário

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // 🚨 Verificar se todos os campos foram preenchidos
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    // 🚨 Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "As senhas não coincidem!" });
    }

    // 🚨 Verificar se o email já está cadastrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Este email já está cadastrado!" });
    }

    // 🔒 Hashear a senha antes de salvar no banco (Recomendado para segurança)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🟢 Criar o usuário no banco de dados
    const newUser = await User.create({ username, email, password: hashedPassword });

    return res.status(201).json({ message: "Usuário cadastrado com sucesso!", user: newUser });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
});

export default router;