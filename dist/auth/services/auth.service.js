"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("typeorm");
const bcryptjs_1 = require("bcryptjs");
let AuthService = class AuthService {
    jwtService;
    dataSource;
    constructor(jwtService, dataSource) {
        this.jwtService = jwtService;
        this.dataSource = dataSource;
    }
    async login(loginDto) {
        const { email, nickName, password } = loginDto;
        const loginField = email || nickName;
        if (!loginField)
            throw new common_1.HttpException('Email o nickName son requeridos', common_1.HttpStatus.BAD_REQUEST);
        if (!password)
            throw new common_1.HttpException('Password es requerido', common_1.HttpStatus.BAD_REQUEST);
        const resultData = await this.validateUser(loginField);
        const { passwordHash, isVerified, result: procedureResult } = resultData;
        if (procedureResult === 'USER_NOT_FOUND') {
            throw new common_1.HttpException('El nickName o correo no existen.', common_1.HttpStatus.NOT_FOUND);
        }
        const validatePass = await this.validatePassword(password, passwordHash);
        if (!validatePass) {
            throw new common_1.HttpException('Contraseña incorrecta.', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (Number(isVerified) === 0) {
            throw new common_1.HttpException('Usuario no verificado.', common_1.HttpStatus.FORBIDDEN);
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
    async storeSession(userUuid, refreshToken) {
        try {
            await this.dataSource.query('CALL store_user_session(?, ?)', [
                userUuid,
                refreshToken,
            ]);
        }
        catch (error) {
            if (error.message.includes('El usuario ya tiene una sesión activa')) {
                throw new common_1.HttpException('El usuario ya tiene una sesión activa.', common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException('Error al guardar sesión', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async refreshToken(refreshToken) {
        try {
            if (!refreshToken) {
                throw new common_1.HttpException('Token de refresco requerido', common_1.HttpStatus.BAD_REQUEST);
            }
            const decodedWithoutVerify = this.jwtService.decode(refreshToken);
            if (!decodedWithoutVerify || !decodedWithoutVerify.uuid) {
                throw new common_1.HttpException('Token inválido', common_1.HttpStatus.UNAUTHORIZED);
            }
            const decoded = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
            const session = await this.dataSource.query(`CALL get_valid_session(?, ?)`, [decoded.uuid, refreshToken]);
            if (!session || session.length === 0) {
                throw new common_1.HttpException('Sesión inválida o expirada.', common_1.HttpStatus.UNAUTHORIZED);
            }
            const user = await this.getUserByUuid(decoded.uuid);
            if (!user) {
                throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.UNAUTHORIZED);
            }
            if (decoded.tokenVersion !== user.token_version) {
                throw new common_1.HttpException('Versión de token inválida', common_1.HttpStatus.UNAUTHORIZED);
            }
            const newAccessToken = this.generateJwtToken(user);
            const newRefreshToken = this.generateRefreshToken(user);
            await this.dataSource.query(`CALL update_session_token(?, ?)`, [
                session[0][0].session_id,
                newRefreshToken,
            ]);
            return {
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
                user: this.buildUserResponse(user),
            };
        }
        catch (error) {
            throw new common_1.HttpException('Token inválido o expirado', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async validateUser(nickNameOrEmail) {
        await this.dataSource.query(`CALL validate_session(?, @p_password_hash, @p_user_verified, @p_result);`, [nickNameOrEmail]);
        const [resultData] = await this.dataSource.query(`SELECT 
        @p_password_hash AS passwordHash, 
        @p_user_verified AS isVerified, 
        @p_result AS result;`);
        if (!resultData || !('passwordHash' in resultData)) {
            throw new common_1.HttpException('Error al validar las credenciales.', common_1.HttpStatus.UNAUTHORIZED);
        }
        return resultData;
    }
    async validatePassword(password, passwordHash) {
        try {
            return await (0, bcryptjs_1.compare)(password, passwordHash);
        }
        catch (err) {
            throw new common_1.HttpException('Error al validar contraseña.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUser(nickNameOrEmail) {
        const [rows] = await this.dataSource.query(`CALL GetUserByNicknameOrEmail(?, ?)`, [nickNameOrEmail, nickNameOrEmail]);
        const user = rows[0];
        if (!user) {
            throw new common_1.HttpException('Hubo un error al procesar el inicio de sesión.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return user;
    }
    async getUserByUuid(uuid) {
        const [resultSets] = await this.dataSource.query(`CALL get_user_by_uuid(?)`, [uuid]);
        const user = resultSets[0];
        if (!user) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    generateJwtToken(user) {
        const payload = {
            uuid: user.uuid,
            tokenVersion: user.token_version,
        };
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '15m',
        });
    }
    generateRefreshToken(user) {
        const payload = {
            uuid: user.uuid,
            tokenVersion: user.token_version,
        };
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });
    }
    buildUserResponse(user) {
        return {
            uuid: user.uuid,
            email: user.email,
            token_version: user.token_version,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_1.DataSource])
], AuthService);
//# sourceMappingURL=auth.service.js.map