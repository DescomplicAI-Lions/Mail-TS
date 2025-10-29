import { SMTPConfig } from '../types/email';

// Configuração de exemplo - em produção use variáveis de ambiente
export const smtpConfig: SMTPConfig = {
  host: process.env.SMTP_HOST || 'smtp.exemplo.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.SMTP_USER || 'usuario@exemplo.com',
  pass: process.env.SMTP_PASS || 'sua_senha_ou_token'
};

// Configuração para desenvolvimento (substitua com seus dados reais)
export const smtpConfigDesenvolvimento: SMTPConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: 'seu-email@gmail.com',
  pass: 'sua-senha-de-app'
};
