import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enviarEmail } from './services/emailService';
import { smtpConfig } from './config/emailConfig'; 
import { OpcoesEmail } from './types/email';

export default async function (request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed. Only POST requests are accepted.' });
  }

  const { to, resetUrl } = request.body;

  if (!to || !resetUrl) {
    return response.status(400).json({ message: 'Missing "to" or "resetUrl" in request body.' });
  }

  const opcoesEmail: OpcoesEmail = {
    from: process.env.EMAIL_FROM || '"Your App" <noreply@your-app.com>', 
    to: to,
    subject: 'Redefinição de Senha ou Login Mágico',
    html: `
      <p>Olá,</p>
      <p>Você solicitou uma redefinição de senha ou um login mágico para sua conta.</p>
      <p>Clique no link abaixo para continuar:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Este link é válido por 15 minutos.</p>
      <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
    `,
    text: `Olá,\nVocê solicitou uma redefinição de senha ou um login mágico para sua conta.\nClique no link abaixo para continuar: ${resetUrl}\nEste link é válido por 15 minutos.\nSe você não solicitou isso, por favor, ignore este e-mail.`
  };

  try {
    const result = await enviarEmail(smtpConfig, opcoesEmail);
    console.log(`[MailService] Email sent to ${to}. Message ID: ${result.messageId}`);
    response.status(200).json({ message: 'Email sent successfully.', messageId: result.messageId });
  } catch (error: any) {
    console.error(`[MailService] Error sending email to ${to}:`, error.message);
    response.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
}