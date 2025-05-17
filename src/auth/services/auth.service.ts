import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { LoginDto } from '../dto/login.dto';
import { LoginResponse } from '../interfaces/login-response';
import { UserLogin } from '../interfaces/user-login.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  // Service to login the user and validate the credentials, authenticate the user and generate a JWT token
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, nickName, password } = loginDto;

    const loginField = email || nickName;

    if (!loginField) {
      throw new HttpException(
        'Email o nickName son requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!password) {
      throw new HttpException('Password es requerido', HttpStatus.BAD_REQUEST);
    }

    const resultData = await this.validateUser(loginField);
    console.log(resultData)
    const { passwordHash, isVerified, result: procedureResult } = resultData;
    
    if (procedureResult === 'USER_NOT_FOUND') {
      throw new HttpException(
        'El nickName o correo no existen.',
        HttpStatus.NOT_FOUND,
      );
    }

    const validatePass = await this.validatePassword(password, passwordHash);
    await this.validatePassword(password, passwordHash);
    if (!validatePass) {
      throw new HttpException(
        'Contraseña incorrecta.',
        HttpStatus.UNAUTHORIZED,
      );
    };

    if (Number(isVerified) === 0) {
      throw new HttpException('Usuario no verificado.', HttpStatus.FORBIDDEN);
    };

    // If the user is verified and the password is correct, proceed to get the user and generate a JWT token
    const user = await this.getUser(loginField);
    const accessToken = this.generateJwtToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Return the token and user data
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: this.buildUserResponse(user),
    };
  }

  // Function to validate the user credentials
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

  // Function to validate the password
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

  // Function to get the user data
  private async getUser(nickNameOrEmail: string) {
    const [user] = await this.dataSource.query(
      `CALL GetUserByNicknameOrEmail(?, ?)`,
      [nickNameOrEmail, nickNameOrEmail],
    );

    if (!user) {
      throw new HttpException(
        'Hubo un error al procesar el inicio de sesión.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return user;
  }

  private async getUserByUuid(uuid: string) {
  const [user] = await this.dataSource.query(
    `CALL get_user_by_uuid(?)`,
    [uuid],
  );

  if (!user) {
    throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
  }

  return user;
}


  // Function to generate access token
  private generateJwtToken(user: UserLogin) {
    const payload = { uuid: user.uuid, tokenVersion: user.token_version };
    return this.jwtService.sign(payload, {secret: process.env.JWT_SECRET, expiresIn: '15m'});
  }

  //Generate refresh token
  private generateRefreshToken(user: UserLogin){
    const payload = {uuid: user.uuid, tokenVersion: user.token_version};
    return this.jwtService.sign(payload, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d'})
  }

  // Refresh token functionality
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const decoded = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      const user = await this.getUserByUuid(decoded.uuid); // Get user details
      const accessToken = this.generateJwtToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        access_token: accessToken,
        refresh_token: newRefreshToken,
        user: this.buildUserResponse(user),
      };
    } catch (error) {
      throw new HttpException('Token inválido o expirado', HttpStatus.UNAUTHORIZED);
    }
  }

  // Function to build the user response
  private buildUserResponse(user: UserLogin) {
    return {
      uuid: user.uuid,
      email: user.email,
      token_version: user.token_version,
    };
  }
}




