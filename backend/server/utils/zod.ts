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

export const alterarContaParcial = z.object({
  id: z.number({ required_error: 'ID do usuário não recebido' }),
  usuario: z.string().min(1, { message: 'Preencha seu usuário' }).optional(),
  email: z.string().email({ message: 'Preencha um email válido' }).optional(),
  senha: z.string().min(1, { message: 'Preencha sua senha' }).optional(),
  repetirSenha: z.string().min(1, { message: 'Repita sua senha' }).optional(),
})
  .refine(data => data.senha === data.repetirSenha, { message: 'As senhas não coincidem', path: ['repetirSenha'] })
