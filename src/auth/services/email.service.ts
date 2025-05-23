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
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    } as nodemailer.TransportOptions);
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
                        <p>copia y pega el token en tu aplicacion para verificar tu cuenta</p>
                       <a>${token}</a>
                       <p>Si no te registraste en Lumitech, ignora este correo.</p>`,
      });
      //console.log('Mensaje enviado: %s', info.messageId);
      console.log(`Token de verificación: ${token}`);
    } catch (error) {
      console.error('Error enviando el correo: ', error);

      throw new HttpException(
        'No se pudo enviar el correo de verificación.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendRecoveryEmail(
    email: string,
    name: string,
    resetToken: string,
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"Lumitech" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recuperación de contraseña en Lumitech',
        html: `<p>Hola, ${name},</p>
                      <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para restablecerla:</p>
                      <p>copia y pega el token en tu aplicacion para reestablecer tu contraseña</p>
                      <a>${resetToken}</a>
                      <p>Si no solicitaste el restablecimiento de contraseña, ignora este correo.</p>`,
      });

      console.log('Correo de recuperacion enviado: ', info.messageId);
    } catch (error) {
      console.error('Error enviando el correo de recuperación: ', error);
      throw new HttpException(
        'No se pudo enviar el correo de recuperación.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
