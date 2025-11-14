import type { VercelRequest, VercelResponse } from "@vercel/node";
import { smtpConfig } from "./config/emailConfig";
import { enviarEmail } from "./services/emailService";
import { OpcoesEmail } from "./types/email";

export default async function (
   request: VercelRequest,
   response: VercelResponse
) {
   if (request.method !== "POST") {
      return response.status(405).json({
         message: "Method Not Allowed. Only POST requests are accepted.",
      });
   }

   const { to, subject, html, text } = request.body;

   if (!to || !subject || (!html && !text)) {
      return response
         .status(400)
         .json({ message: 'Missing "to", "subject", or email content (html/text) in request body.' });
   }

   const opcoesEmail: OpcoesEmail = {
      from: process.env.EMAIL_FROM || '"DescomplicAi" <noreply@descomplicai.com>',
      to: to,
      subject: subject, 
      html: html,      
      text: text,       
   };

   try {
      const result = await enviarEmail(smtpConfig, opcoesEmail);
      console.log(
         `[MailService] Email sent to ${to}. Message ID: ${result.messageId}`
      );
      response.status(200).json({
         message: "Email sent successfully.",
         messageId: result.messageId,
      });
   } catch (error: any) {
      console.error(
         `[MailService] Error sending email to ${to}:`,
         error.message
      );
      response
         .status(500)
         .json({ message: "Failed to send email.", error: error.message });
   }
}