import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Config. nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Method to send verification email
  async sendVerificationEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Lumitech" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verifica tu cuenta en Lumitech',
        html: `<p>Hola, ${name},</p>
                       <p>Gracias por registrarte en Lumitech. Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
                       <a href="${process.env.FRONTEND_URL2}/confirmar/${token}">Verificar cuenta</a>
                       <p>Si no te registraste en Lumitech, ignora este correo.</p>`,
      });
      //console.log('Mensaje enviado: %s', info.messageId);
      console.log(`Token de verificación: ${token}`);
      console.log(
        `URL temporal para verificación: http://localhost:3000/user/confirm/${token}`,
      );
    } catch (error) {
      console.error('Error enviando el correo: ', error);

      throw new HttpException('No se pudo enviar el correo de verificación.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendRecoveryEmail(email: string, resetLink: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Lumitech" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recuperación de contraseña en Lumitech',
        html: `<p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para restablecerla:</p>
                <a href="${resetLink}">Restablecer contraseña</a>
                <p>Si no solicitaste el restablecimiento de contraseña, ignora este correo.</p>`,
      });

      console.log('Correo de recuperacion enviado: ', info.messageId);
    } catch (error) {
      console.error('Error enviando el correo de recuperación: ', error);
      throw new HttpException('No se pudo enviar el correo de recuperación.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
