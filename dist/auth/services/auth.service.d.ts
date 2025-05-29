import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { LoginDto } from '../dto/login.dto';
import { LoginResponse } from '../interfaces/login-response';
export declare class AuthService {
    private readonly jwtService;
    private readonly dataSource;
    constructor(jwtService: JwtService, dataSource: DataSource);
    login(loginDto: LoginDto): Promise<LoginResponse>;
    private storeSession;
    refreshToken(refreshToken: string): Promise<LoginResponse>;
    private validateUser;
    private validatePassword;
    private getUser;
    private getUserByUuid;
    private generateJwtToken;
    private generateRefreshToken;
    private buildUserResponse;
}
