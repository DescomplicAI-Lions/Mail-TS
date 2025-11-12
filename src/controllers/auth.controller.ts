import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { smtpConfig } from "../config/emailConfig"; // Use a config de prod/dev
import { enviarEmail } from "../services/emailService";
import { OpcoesEmail } from "../types/email";

// Carrega o .env (importante para o JWT_SECRET)
dotenv.config();

// Pega o segredo do .env
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
   throw new Error("Erro: JWT_SECRET não definido no .env");
}

/**
 * Lógica de "Esqueci a Senha"
 * (Em um projeto real, isso seria chamado pela sua Rota/Endpoint)
 */
export async function solicitarRecuperacaoSenha(emailDoUsuario: string) {
   console.log(`Solicitação de recuperação para: ${emailDoUsuario}`);

   // --- 1. Verifique se o usuário existe (Simulação) ---
   // TODO: Substitua isso pela sua lógica real de banco de dados
   // const usuario = await seuBanco.user.findUnique({ where: { email: emailDoUsuario } });
   // if (!usuario) {
   //   console.warn('Tentativa de recuperação para e-mail não existente.');
   //   // (Não retorne erro para o usuário por segurança, apenas não envie o e-mail)
   //   return;
   // }

   // --- 2. Gerar o Token de Recuperação ---
   // Este token será válido por 1 hora (3600 segundos)
   const tokenDeRecuperacao = jwt.sign(
      { email: emailDoUsuario }, // O "payload" - o que o token carrega
      JWT_SECRET!, // O "segredo" para assinar o token
      { expiresIn: "1h" } // Tempo de expiração
   );

   // --- 3. Montar o Link de Recuperação ---
   // Este é o link que o usuário vai clicar no e-mail
   const link = `https://www.seu-frontend.com/resetar-senha?token=${tokenDeRecuperacao}`;

   // --- 4. Preparar o E-mail ---
   const opcoes: OpcoesEmail = {
      from: '"Seu App" <nao-responda@seuapp.com>', // Use um e-mail "from" genérico
      to: emailDoUsuario,
      subject: "Redefinição de Senha Solicitada",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Esqueceu sua senha?</h2>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
        <p>Clique no botão abaixo para criar uma nova senha. Este link é válido por 1 hora.</p>
        <a href="${link}" 
           style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
           Redefinir Senha
        </a>
        <p>Se você não solicitou isso, pode ignorar este e-mail com segurança.</p>
      </div>
    `,
      text: `Para redefinir sua senha, copie e cole este link no seu navegador: ${link}`,
   };

   // --- 5. Enviar o E-mail usando seu serviço ---
   try {
      await enviarEmail(smtpConfig, opcoes); // (Use a config apropriada)
      console.log(
         `✅ E-mail de recuperação enviado com sucesso para ${emailDoUsuario}`
      );
   } catch (error) {
      console.error(
         `❌ Erro ao enviar e-mail de recuperação para ${emailDoUsuario}:`,
         error
      );
   }
}

// --- Para Testar este arquivo (como fizemos com o index.ts) ---

async function testarRecuperacao() {
   // Simula uma chamada de API
   await solicitarRecuperacaoSenha(process.env.GMAIL_USER!); // Envia o teste para seu próprio e-mail
}

// Rode `npx ts-node controllers/auth.controller.ts` para testar
testarRecuperacao().catch(console.error);
