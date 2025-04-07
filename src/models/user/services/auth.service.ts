import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async login(nicknameOrEmail: string, password: string) {

    await this.dataSource.query(`
      CALL validate_session(?, @p_password_hash, @p_user_verified, @p_result);
    `, [nicknameOrEmail]);

    const resultData = await this.dataSource.query(`
      SELECT 
        @p_password_hash AS password_hash, 
        @p_user_verified AS verified, 
        @p_result AS result;
    `);


    if (!resultData || !resultData[0]) {
      throw new HttpException('Error al obtener datos de sesión.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const { password_hash, verified, result: procedureResult } = resultData[0];

    // if user not found
    if (procedureResult === 'USER_NOT_FOUND') {
      throw new HttpException('El nickname o correo no existen.', HttpStatus.NOT_FOUND);
    }

    // Validate password
    const isPasswordValid = await compare(password, password_hash);
    if (!isPasswordValid) {
      throw new HttpException('Contraseña incorrecta.', HttpStatus.UNAUTHORIZED);
    }

    // validate if user is verified
    if (verified === 0) {
      throw new HttpException('Usuario no verificado.', HttpStatus.FORBIDDEN);
    }

    // search user to generate token
    const [user] = await this.dataSource.query(`
      SELECT uuid, user_name, user_nickname, user_email 
      FROM user 
      WHERE user_nickname = ? OR user_email = ?
      LIMIT 1;
    `, [nicknameOrEmail, nicknameOrEmail]);

    if (!user) {
      throw new HttpException('Error interno. Usuario no encontrado después de validar.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // generate token
    const payload = { uuid: user.uuid };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        uuid: user.uuid,
        name: user.user_name,
        nickname: user.user_nickname,
        email: user.user_email,
      },
    };
  }
}
