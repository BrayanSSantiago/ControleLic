import z from 'zod'

export const AuthSchema = z.object({
  usuario: z.string().min(1, { message: 'Preencha seu usuário' }),
  senha: z.string().min(1, { message: 'Preencha sua senha' }),
})

export const UsuarioSchema = z.object({
  usuario: z.string().min(1, { message: 'Preencha seu usuário' }),
  email: z.string().email({ message: 'Preencha um email válido' }),
  senha: z.string().min(1, { message: 'Preencha sua senha' }),
  repetirSenha: z.string().min(1, { message: 'Repita sua senha' }),
})
  .refine(data => data.senha === data.repetirSenha, { message: 'As senhas não coincidem', path: ['repetirSenha'] })
