import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {EmailService} from '../services/email/email.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { user_name, user_last_name, user_nickname, user_email, user_password } = createUserDto;

    //verify user already exist
    await this.dataSource.query(
      'CALL validate_user(?, ?, @p_result)',
      [user_nickname, user_email]
    );

    const result = await this.dataSource.query('SELECT @p_result as result');
    const message = result[0].result;
    
    if(message !== 'VALID'){
      throw new BadRequestException(message)
    }

    //Hash password
    const hashedPassword = await hash(user_password, 10);
    const verificationToken = uuidv4();
    const userUUID = uuidv4();

    //Insert User
    await this.dataSource.query(
      'CALL register_user(?, ?, ?, ?, ?, ?, ?)', 
      [user_name, user_last_name, user_nickname, user_email, hashedPassword, verificationToken, userUUID]
    );

    //Send verification email
    await this.emailService.sendVerificationEmail(user_email, user_name, verificationToken);
  }

  async confirmUserEmail(token: string): Promise<{msg: string}> {
    try{
      const result = await this.dataSource.query('CALL verify_email(?)',[token]);
      return {msg: "Usuario verificado correctamente"}

    }catch(error){

      if(
        error?.code === 'ER_SIGNAL_EXCEPTION' || error?.errno === 1644 ||  error?.sqlMessage?.includes('Token de verificación inválido')
      ){
        throw new BadRequestException('Token de verificacion invalido o ya utilizado');
      }

    // error not related to token
    console.error('Error inesperado al verificar token:', error);
    throw new Error('Error interno al verificar el token');
    }
  }

  async forgetPassword(email: string): Promise<{ msg: string }> {
    const resetToken = uuidv4(); 

    await this.dataSource.query(
      'CALL generate_reset_token(?, ?, @expiration_time)',
      [email, resetToken]
    );
  
  
    const resultExpiration = await this.dataSource.query('SELECT @expiration_time AS expiration_time');
    const expirationTime = resultExpiration[0].expiration_time;
  
    if (!expirationTime) {
      throw new BadRequestException('Usuario no encontrado');
    }

    console.log(`Este es tu token para restablecer tu password ${resetToken}`)
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await this.emailService.sendRecoveryEmail(email, resetLink);
  
    return { msg: 'Se ha enviado un enlace de recuperación a tu correo' };
}


  async resetPassword(token: string, newPassword: string): Promise<{ msg: string }> {
    
    //Hash new pass
    const hashedPassword = await hash(newPassword, 10);
  
    const res = await this.dataSource.query('CALL reset_user_password(?, ?, @result_message)', [token, hashedPassword]);
  
  
    const messageResult = await this.dataSource.query('SELECT @result_message AS result_message');
    const message = messageResult[0].result_message;
  
    if (message === 'Token invalido' || message === 'Token expirado') {
      throw new BadRequestException(message);
    }
  
    return { msg: message };
  }

}