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
  senha: z.string().optional().or(z.literal('')),
  repetirSenha: z.string().optional().or(z.literal('')),
  avatar: z.string().optional(),

})
  .refine(data => {
  // Só valida se ambas as senhas foram fornecidas
    if(data.senha || data.repetirSenha){
      return data.senha === data.repetirSenha
    }
    return true
  }, {
    message: 'As senhas não coincidem',
    path: ['repetirSenha'],
  })
