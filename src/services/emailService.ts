import nodemailer, { Transporter } from 'nodemailer';
import { SMTPConfig, OpcoesEmail } from '../types/email';

export function criarTransportador(config: SMTPConfig): Transporter {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass
    }
  });
}

export async function enviarEmail(
  smtpConfig: SMTPConfig, 
  opcoesEmail: OpcoesEmail
): Promise<any> {
  const transportador = criarTransportador(smtpConfig);
  
  try {
    const resultado = await transportador.sendMail(opcoesEmail);
    return resultado;
  } catch (erro) {
    throw new Error(`Erro ao enviar e-mail: ${erro}`);
  }
}
