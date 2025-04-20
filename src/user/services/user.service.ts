import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EmailService } from '../../auth/services/email.service';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { hash, compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import {
  ChangePasswordDto,
  ChangeUserLastNameDto,
} from 'src/auth/dto/modified-data-user.dto';
import { ChangeUserNameDto } from 'src/auth/dto/modified-data-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { userName, userLastName, userNickName, userEmail, userPassword } =
      createUserDto;

    //verify user already exist
    await this.dataSource.query('CALL validate_user(?, ?, @p_result)', [
      userNickName,
      userEmail,
    ]);

    const result = await this.dataSource.query('SELECT @p_result as result');
    const message = result[0].result;

    if (message !== 'VALID') {
      throw new BadRequestException(message);
    }

    //Hash password
    const hashedPassword = await hash(userPassword, 10);
    const verificationToken = uuidv4();
    const userUUID = uuidv4();

    //Insert User
    await this.dataSource.query('CALL register_user(?, ?, ?, ?, ?, ?, ?)', [
      userName,
      userLastName,
      userNickName,
      userEmail,
      hashedPassword,
      verificationToken,
      userUUID,
    ]);

    //Send verification email
    await this.emailService.sendVerificationEmail(
      userEmail,
      userName,
      verificationToken,
    );
  }
  async confirmUserEmail(token: string): Promise<{ msg: string }> {
    try {
      //validate token
      if (!token) {
        throw new HttpException(
          'Token no proporcionado',
          HttpStatus.BAD_REQUEST,
        );
      }

      //Call procedure verify email
      const resultVerifyEmail = await this.dataSource.query(
        'CALL verify_email(?)',
        [token],
      );

      if (!resultVerifyEmail || resultVerifyEmail.length === 0) {
        throw new HttpException(
          'Token de verificación no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      return { msg: 'Usuario verificado correctamente' };
    } catch (error) {
      console.error('Error inesperado al verificar token:', error);

      //Verify especifics error types
      if (
        error?.code === 'ER_SIGNAL_EXCEPTION' ||
        error?.errno === 1644 ||
        error?.sqlMessage?.includes('Token de verificación inválido')
      ) {
        throw new HttpException(
          'Token de verificación inválido o ya utilizado',
          HttpStatus.NOT_FOUND,
        );
      }

      // Generic error
      throw new HttpException(
        'Error interno al verificar el token. Inténtalo nuevamente.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async forgetPassword(email: string): Promise<{ msg: string }> {
    const resetToken = uuidv4();

    try {
      //Call procedure generate recovery token

      await this.dataSource.query(
        'CALL generate_reset_token(?, ?, @expiration_time)',
        [email, resetToken],
      );

      const resultExpiration = await this.dataSource.query(
        'SELECT @expiration_time AS expiration_time',
      );
      const expirationTime = resultExpiration[0].expiration_time;

      if (!expirationTime) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      // Generate link recovery
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      // Send email link
      await this.emailService.sendRecoveryEmail(email, resetLink);

      console.log(resetToken);
      return { msg: 'Se ha enviado un enlace de recuperación a tu correo' };
    } catch (error) {
      throw new HttpException(
        'Error al generar el enlace de recuperación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ msg: string }> {
    const { userNewPassword } = resetPasswordDto;

    if (!token || !userNewPassword) {
      throw new HttpException(
        'Faltan parámetros requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.dataSource.query(
      'CALL get_user_password_by_token(?, @current_password)',
      [token],
    );

    const [passwordResult] = await this.dataSource.query(
      'SELECT @current_password AS current_password',
    );

    const currentPassword = passwordResult?.current_password;

    if (!currentPassword) {
      throw new BadRequestException('Usuario no encontrado o token inválido');
    }

    // Comparar con la nueva contraseña
    const isSamePassword = await compare(userNewPassword, currentPassword);

    if (isSamePassword) {
      throw new BadRequestException(
        'La nueva contraseña no puede ser igual a la anterior.',
      );
    }

    const hashedPassword = await hash(userNewPassword, 10);

    const result = await this.dataSource.query(
      'CALL reset_user_password(?, ?)',
      [token, hashedPassword],
    );

    const resultPasswordReset = result?.[0]?.[0]?.result_message;

    if (
      resultPasswordReset == 'Token invalido' ||
      resultPasswordReset == 'Token expirado'
    ) {
      throw new BadRequestException(resultPasswordReset);
    }

    return { msg: resultPasswordReset };
  }

  async changePassword(
    uuid: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ msg: string }> {
    const { currentPassword, userNewPassword } = changePasswordDto;

    await this.dataSource.query(`CALL get_user_password(?, @user_password)`, [
      uuid,
    ]);

    const resultHash = await this.dataSource.query(
      `SELECT @user_password AS user_password`,
    );

    const hashPassDb = resultHash[0]?.user_password;

    if (!hashPassDb) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    const match = await compare(currentPassword, hashPassDb);
    if (!match) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    const isSamePassword = await compare(userNewPassword, hashPassDb);
    if (isSamePassword) {
      throw new BadRequestException(
        'La nueva contraseña no puede ser igual a la anterior',
      );
    }

    const newHashedPassword = await hash(userNewPassword, 10);

    await this.dataSource.query(`CALL change_user_password(?, ?, @message)`, [
      uuid,
      newHashedPassword,
    ]);

    const resultUpdatePassword = await this.dataSource.query(
      `SELECT @message as msg`,
    );

    return { msg: resultUpdatePassword[0]?.msg };
  }

  async changeUserName(
    uuid: string,
    changeUserNameDto: ChangeUserNameDto,
  ): Promise<{ msg: string }> {
    const { userName } = changeUserNameDto;

    try {
      await this.dataSource.query('CALL change_user_name(?, ?, @message)', [
        uuid,
        userName,
      ]);

      const resultUpdateName = await this.dataSource.query(
        'SELECT @message AS msg',
      );

      return { msg: resultUpdateName[0]?.msg };
    } catch (error) {
      throw new HttpException(
        'Error al actualizar el nombre',
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async changeUserLastName(
    uuid: string,
    changeUserLastNameDto: ChangeUserLastNameDto,
  ): Promise<{ msg: string }> {
    const { userLastName } = changeUserLastNameDto;

    try {
      await this.dataSource.query('CALL change_user_lastname(?,?, @message)', [
        uuid,
        userLastName,
      ]);

      const resultUpdateLastName = await this.dataSource.query(
        'SELECT @message AS msg',
      );

      return { msg: resultUpdateLastName[0]?.msg };
    } catch (error) {
      throw new HttpException(
        'Error al actualizar el apellido',
        HttpStatus.NOT_MODIFIED,
      );
    }
  }
}
