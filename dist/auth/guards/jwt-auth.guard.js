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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("typeorm");
const jsonwebtoken_1 = require("jsonwebtoken");
let JwtAuthGuard = class JwtAuthGuard {
    jwtService;
    dataSource;
    constructor(jwtService, dataSource) {
        this.jwtService = jwtService;
        this.dataSource = dataSource;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('No se proporcionó un token válido.');
        }
        const token = authHeader.split(' ')[1];
        console.log('Token recibido:', token);
        try {
            const decoded = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            console.log('Decoded payload:', decoded);
            const [tokenVersion] = await this.dataSource.query(`CALL get_token_version(?)`, [decoded.uuid]);
            console.log(tokenVersion);
            const version = tokenVersion[0];
            console.log(version);
            const dbTokenVersion = version?.token_version;
            console.log(dbTokenVersion);
            if (dbTokenVersion === undefined) {
                throw new common_1.UnauthorizedException('No se pudo verificar la versión del token.');
            }
            if (dbTokenVersion === null || dbTokenVersion === undefined) {
                throw new common_1.UnauthorizedException('No se pudo verificar la versión del token.');
            }
            if (Number(decoded.tokenVersion) !== Number(dbTokenVersion)) {
                throw new common_1.UnauthorizedException('El token ya no es válido (versión desactualizada).');
            }
            request.user = decoded;
            return true;
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                throw new common_1.UnauthorizedException('El token ha expirado. Inicia sesión de nuevo.');
            }
            if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
                throw new common_1.UnauthorizedException('El token no es válido.');
            }
            throw new common_1.UnauthorizedException('Acceso no autorizado.');
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_1.DataSource])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map