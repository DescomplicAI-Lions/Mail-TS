import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { smtpConfig } from "../config/emailConfig";
import { enviarEmail } from "../services/emailService";
import { OpcoesEmail } from "../types/email";

// Interface para o payload do token (boa prática)
interface JwtPayload {
   email: string;
}

// Carrega o .env (importante para o JWT_SECRET)
dotenv.config();

// Pega o segredo do .env
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
   throw new Error("Erro: JWT_SECRET não definido no .env");
}

/**
 * Lógica de "Esqueci a Senha"
 * (Gera token e envia o e-mail)
 */
export async function solicitarRecuperacaoSenha(emailDoUsuario: string) {
   console.log(`Solicitação de recuperação para: ${emailDoUsuario}`);

   // TODO: Adicionar lógica real de banco de dados para verificar se o usuário existe

   // --- 1. Gerar o Token de Recuperação ---
   const tokenDeRecuperacao = jwt.sign(
      { email: emailDoUsuario }, // O payload
      JWT_SECRET!, // O segredo (com '!' para o TypeScript)
      { expiresIn: "1h" } // Tempo de expiração
   );

   // --- 2. Montar o Link de Recuperação ---
   const link = `https://www.seu-frontend.com/resetar-senha?token=${tokenDeRecuperacao}`;

   // --- 3. Preparar o E-mail ---
   const opcoes: OpcoesEmail = {
      from: '"Seu App" <nao-responda@seuapp.com>',
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

   // --- 4. Enviar o E-mail ---
   try {
      await enviarEmail(smtpConfig, opcoes);
      console.log(
         `✅ E-mail de recuperação enviado com sucesso para ${emailDoUsuario}`
      );
   } catch (error) {
      // Correção: Verificar o tipo do 'error' antes de usar .message
      if (error instanceof Error) {
         console.error(
            `❌ Erro ao enviar e-mail de recuperação para ${emailDoUsuario}:`,
            error.message
         );
      } else {
         console.error(
            `❌ Erro desconhecido ao enviar e-mail para ${emailDoUsuario}:`,
            error
         );
      }
   }
}

/**
 * Lógica de "Redefinir a Senha"
 * (Verifica o token e atualiza a senha)
 */
export async function redefinirSenha(token: string, novaSenha: string) {
   try {
      // --- 1. Verificar o Token ---
      // Correção: A lógica dependente (payload, hash, db) vai DENTRO do 'try'
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const emailDoUsuario = payload.email;
      console.log(`Token válido. Redefinindo senha para: ${emailDoUsuario}`);

      // --- 2. Hashear (Criptografar) a Nova Senha ---
      const saltRounds = 10;
      const hashDaSenha = await bcrypt.hash(novaSenha, saltRounds);

      // --- 3. Salvar no Banco de Dados (Simulação) ---
      // TODO: Substitua esta simulação pela sua lógica real de banco de dados
      console.log("--- SIMULAÇÃO DE BANCO DE DADOS ---");
      console.log(`Usuário encontrado: ${emailDoUsuario}`);
      console.log(
         `Nova senha hasheada salva: ${hashDaSenha.substring(0, 20)}...`
      );
      console.log("--- SENHA ATUALIZADA NO BANCO (simulado) ---");

      // O 'return' de sucesso fica no final do 'try'
      return { success: true, message: "Senha redefinida com sucesso." };
   } catch (error) {
      // Correção: Verificar o tipo do 'error' antes de usar .message
      if (error instanceof Error) {
         console.error("Erro ao verificar token:", error.message);
      } else {
         console.error("Ocorreu um erro desconhecido:", error);
      }

      // O 'throw' de falha fica no 'catch'
      throw new Error("Token inválido ou expirado.");
   }
}
