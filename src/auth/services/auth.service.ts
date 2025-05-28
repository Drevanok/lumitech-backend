import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { compare } from 'bcryptjs';
import { LoginDto } from '../dto/login.dto';
import { LoginResponse } from '../interfaces/login-response';
import { UserLogin } from '../interfaces/user-login.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, nickName, password } = loginDto;
    const loginField = email || nickName;

    if (!loginField)
      throw new HttpException(
        'Email o nickName son requeridos',
        HttpStatus.BAD_REQUEST,
      );

    if (!password)
      throw new HttpException('Password es requerido', HttpStatus.BAD_REQUEST);

    const resultData = await this.validateUser(loginField);
    const { passwordHash, isVerified, result: procedureResult } = resultData;

    if (procedureResult === 'USER_NOT_FOUND') {
      throw new HttpException(
        'El nickName o correo no existen.',
        HttpStatus.NOT_FOUND,
      );
    }

    const validatePass = await this.validatePassword(password, passwordHash);
    if (!validatePass) {
      throw new HttpException(
        'Contraseña incorrecta.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (Number(isVerified) === 0) {
      throw new HttpException('Usuario no verificado.', HttpStatus.FORBIDDEN);
    }

    const user = await this.getUser(loginField);

    const accessToken = this.generateJwtToken(user);
    const refreshToken = this.generateRefreshToken(user);

    await this.storeSession(user.uuid, refreshToken);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: this.buildUserResponse(user),
    };
  }

  private async storeSession(userUuid: string, refreshToken: string) {
    try {
      await this.dataSource.query('CALL store_user_session(?, ?)', [
        userUuid,
        refreshToken,
      ]);
    } catch (error) {
      if (error.message.includes('El usuario ya tiene una sesión activa')) {
        throw new HttpException(
          'El usuario ya tiene una sesión activa.',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Error al guardar sesión',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      if (!refreshToken) {
        throw new HttpException(
          'Token de refresco requerido',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Decode (sin verificar) para extraer UUID
      const decodedWithoutVerify = this.jwtService.decode(refreshToken);
      if (!decodedWithoutVerify || !decodedWithoutVerify.uuid) {
        throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
      }

      // Verificar token
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Buscar sesión válida directamente
      const session = await this.dataSource.query(
        `CALL get_valid_session(?, ?)`,
        [decoded.uuid, refreshToken],
      );

      if (!session || session.length === 0) {
        throw new HttpException(
          'Sesión inválida o expirada.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = await this.getUserByUuid(decoded.uuid);
      if (!user) {
        throw new HttpException(
          'Usuario no encontrado',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (decoded.tokenVersion !== user.token_version) {
        throw new HttpException(
          'Versión de token inválida',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const newAccessToken = this.generateJwtToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      // Actualizar token existente
      await this.dataSource.query(`CALL update_session_token(?, ?)`, [
        session[0][0].session_id,
        newRefreshToken,
      ]);

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        user: this.buildUserResponse(user),
      };
    } catch (error) {
      throw new HttpException(
        'Token inválido o expirado',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async validateUser(nickNameOrEmail: string) {
    await this.dataSource.query(
      `CALL validate_session(?, @p_password_hash, @p_user_verified, @p_result);`,
      [nickNameOrEmail],
    );

    const [resultData] = await this.dataSource.query(
      `SELECT 
        @p_password_hash AS passwordHash, 
        @p_user_verified AS isVerified, 
        @p_result AS result;`,
    );

    if (!resultData || !('passwordHash' in resultData)) {
      throw new HttpException(
        'Error al validar las credenciales.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return resultData;
  }

  private async validatePassword(password: string, passwordHash: string) {
    try {
      return await compare(password, passwordHash);
    } catch (err) {
      throw new HttpException(
        'Error al validar contraseña.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async getUser(nickNameOrEmail: string) {
    const [rows] = await this.dataSource.query(
      `CALL GetUserByNicknameOrEmail(?, ?)`,
      [nickNameOrEmail, nickNameOrEmail],
    );

    const user = rows[0];
    if (!user) {
      throw new HttpException(
        'Hubo un error al procesar el inicio de sesión.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return user;
  }

  private async getUserByUuid(uuid: string) {
    const [resultSets] = await this.dataSource.query(
      `CALL get_user_by_uuid(?)`,
      [uuid],
    );

    const user = resultSets[0];

    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  private generateJwtToken(user: UserLogin) {
    const payload = {
      uuid: user.uuid,
      tokenVersion: user.token_version,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(user: UserLogin) {
    const payload = {
      uuid: user.uuid,
      tokenVersion: user.token_version,
    };
    
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  private buildUserResponse(user: UserLogin) {
    return {
      uuid: user.uuid,
      email: user.email,
      token_version: user.token_version,
    };
  }
}
