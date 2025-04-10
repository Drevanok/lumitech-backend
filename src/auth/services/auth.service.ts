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
    const resultData = await this.validateUser(nicknameOrEmail);
    const { password_hash, verified, result: procedureResult } = resultData;


    if (procedureResult === 'USER_NOT_FOUND') {
      throw new HttpException('El nickname o correo no existen.', HttpStatus.NOT_FOUND);
    }

    if (!(await this.validatePassword(password, password_hash))) {
      throw new HttpException('Contraseña incorrecta.', HttpStatus.UNAUTHORIZED);
    }

    if (verified === 0) {
      throw new HttpException('Usuario no verificado.', HttpStatus.FORBIDDEN);
    }

    const user = await this.getUser(nicknameOrEmail);
    const token = this.generateJwtToken(user);

    return {
      token,
      user: this.buildUserResponse(user),
    };
  }

  private async validateUser(nicknameOrEmail: string) {
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

    return resultData[0];
  }

  private async validatePassword(password: string, password_hash: string) {
    return compare(password, password_hash);
  }

  private async getUser(nicknameOrEmail: string) {
    const [user] = await this.dataSource.query(`
      SELECT uuid, user_name, user_nickname, user_email 
      FROM user 
      WHERE user_nickname = ? OR user_email = ?
      LIMIT 1;
    `, [nicknameOrEmail, nicknameOrEmail]);

    if (!user) {
      throw new HttpException('Error interno. Usuario no encontrado después de validar.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return user;
  }

  private generateJwtToken(user: any) {
    const payload = { uuid: user.uuid };
    return this.jwtService.sign(payload);
  }

  private buildUserResponse(user: any) {
    return {
      uuid: user.uuid,
      name: user.user_name,
      nickname: user.user_nickname,
      email: user.user_email,
    };
  }
}
