import { enviarEmail } from './services/emailService';
import { smtpConfigDesenvolvimento } from './config/emailConfig';
import { OpcoesEmail } from './types/email';

async function main() {
  console.log('🚀 Iniciando envio de e-mail...');

  const opcoesEmail: OpcoesEmail = {
    from: '"Seu Nome" <seu-email@gmail.com>',
    to: 'destinatario@exemplo.com',
    subject: 'E-mail de Teste - Amil TS',
    html: `
      <h1>Olá Mundo! 🎉</h1>
      <p>Este é um e-mail de teste enviado via <strong>TypeScript</strong>.</p>
      <p>Funcionou perfeitamente!</p>
    `,
    text: 'Olá Mundo!\nEste é um e-mail de teste enviado via TypeScript.\nFuncionou perfeitamente!'
  };

  try {
    const resposta = await enviarEmail(smtpConfigDesenvolvimento, opcoesEmail);
    console.log('✅ E-mail enviado com sucesso!');
    console.log('ID da mensagem:', resposta.messageId);
    console.log('Resposta:', resposta.response);
  } catch (erro) {
    console.log('❌ Erro ao enviar e-mail:');
    console.error(erro);
  }
}

// Executar a função principal
main().catch(console.error);
