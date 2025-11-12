import * as dotenv from "dotenv";
import { SMTPConfig } from "../types/email";

dotenv.config();

export const smtpConfig: SMTPConfig = {
   host: process.env.SMTP_HOST || "smtp.gmail.com",
   port: parseInt(process.env.SMTP_PORT || "587"),
   secure: process.env.SMTP_SECURE === "true",

   user: (process.env.SMTP_USER || process.env.GMAIL_USER)!,

   pass: (process.env.SMTP_PASS || process.env.GMAIL_PASS)!,
};

export const smtpConfigDesenvolvimento: SMTPConfig = {
   host: "smtp.gmail.com",
   port: 587,
   secure: false,
   user: process.env.GMAIL_USER!,
   pass: process.env.GMAIL_PASS!,
};
