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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const email_service_1 = require("../../auth/services/email.service");
const bcryptjs_1 = require("bcryptjs");
const uuid_1 = require("uuid");
let UserService = class UserService {
    dataSource;
    emailService;
    constructor(dataSource, emailService) {
        this.dataSource = dataSource;
        this.emailService = emailService;
    }
    async createUser(createUserDto) {
        const { userName, userLastName, userNickName, userEmail, userPassword } = createUserDto;
        await this.dataSource.query('CALL validate_user(?, ?, @p_result)', [
            userNickName,
            userEmail,
        ]);
        const result = await this.dataSource.query('SELECT @p_result as result');
        const message = result[0].result;
        if (message !== 'VALID') {
            throw new common_1.BadRequestException(message);
        }
        const hashedPassword = await (0, bcryptjs_1.hash)(userPassword, 10);
        const verificationToken = (0, uuid_1.v4)();
        const userUUID = (0, uuid_1.v4)();
        await this.dataSource.query('CALL register_user(?, ?, ?, ?, ?, ?, ?)', [
            userName,
            userLastName,
            userNickName,
            userEmail,
            hashedPassword,
            verificationToken,
            userUUID,
        ]);
        await this.emailService.sendVerificationEmail(userEmail, userName, verificationToken);
    }
    async confirmUserEmail(verifyEmailTokenDto) {
        const { token } = verifyEmailTokenDto;
        try {
            if (!token) {
                throw new common_1.HttpException('Token no proporcionado', common_1.HttpStatus.BAD_REQUEST);
            }
            const resultVerifyEmail = await this.dataSource.query('CALL verify_email(?)', [token]);
            if (!resultVerifyEmail || resultVerifyEmail.length === 0) {
                throw new common_1.HttpException('Token de verificación no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return { msg: 'Usuario verificado correctamente' };
        }
        catch (error) {
            console.error('Error inesperado al verificar token:', error);
            if (error?.code === 'ER_SIGNAL_EXCEPTION' ||
                error?.errno === 1644 ||
                error?.sqlMessage?.includes('Token de verificación inválido')) {
                throw new common_1.HttpException('Token de verificación inválido o ya utilizado', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Error interno al verificar el token. Inténtalo nuevamente.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resendVerificationEmail(email) {
        const newToken = (0, uuid_1.v4)();
        await this.dataSource.query('CALL resend_verification_token(?, ?, @found_flag, @verified_flag, @user_name_out)', [email, newToken]);
        const [flags] = await this.dataSource.query('SELECT @found_flag AS found, @verified_flag AS verified, @user_name_out AS userName');
        const { found, verified, userName } = flags;
        if (found === 0 || found === '0') {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        if (verified === 1 || verified === '1') {
            throw new common_1.BadRequestException('La cuenta ya esta verificada');
        }
        await this.emailService.sendVerificationEmail(email, userName || 'Usuario', newToken);
        return { msg: 'Correo de verificacion enviado' };
    }
    async getUserProfile(uuid) {
        const [searchUser] = await this.dataSource.query(`CALL get_user_by_uuid(?)`, [uuid]);
        console.log(searchUser);
        if (!searchUser || !searchUser[0]) {
            throw new common_1.HttpException('Usuario no encontrado.', common_1.HttpStatus.NOT_FOUND);
        }
        const user = searchUser[0];
        return {
            name: user.userName,
            userLastName: user.userLastName,
            verify: user.verify,
            email: user.email,
            userNickName: user.userNickName,
        };
    }
    async forgetPassword(email) {
        const resetToken = (0, uuid_1.v4)();
        try {
            await this.dataSource.query('CALL generate_reset_token(?, ?, @verified_flag, @found_flag, @user_name)', [email, resetToken]);
            const [result] = await this.dataSource.query('SELECT @verified_flag AS verified, @found_flag AS found, @user_name AS userName');
            const { verified, found, userName } = result;
            if (found === 0 || found === '0') {
                throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            if (verified === 0 || verified === '0') {
                throw new common_1.HttpException('Tu cuenta no está verificada', common_1.HttpStatus.FORBIDDEN);
            }
            await this.emailService.sendRecoveryEmail(email, userName || 'Usuario', resetToken);
            console.log(resetToken);
            return { msg: 'Se ha enviado un enlace de recuperación a tu correo' };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error al generar el enlace de recuperación', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetPassword(resetPasswordDto) {
        const { token, userNewPassword } = resetPasswordDto;
        if (!token || !userNewPassword) {
            throw new common_1.HttpException('Faltan parámetros requeridos', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.dataSource.query('CALL get_user_password_by_token(?, @current_password)', [token]);
        const [passwordResult] = await this.dataSource.query('SELECT @current_password AS current_password');
        const currentPassword = passwordResult?.current_password;
        if (!currentPassword) {
            throw new common_1.BadRequestException('Usuario no encontrado o token inválido');
        }
        const isSamePassword = await (0, bcryptjs_1.compare)(userNewPassword, currentPassword);
        if (isSamePassword) {
            throw new common_1.BadRequestException('La nueva contraseña no puede ser igual a la anterior.');
        }
        const hashedPassword = await (0, bcryptjs_1.hash)(userNewPassword, 10);
        const result = await this.dataSource.query('CALL reset_user_password(?, ?)', [token, hashedPassword]);
        const resultPasswordReset = result?.[0]?.[0]?.result_message;
        if (resultPasswordReset == 'Token invalido' ||
            resultPasswordReset == 'Token expirado') {
            throw new common_1.BadRequestException(resultPasswordReset);
        }
        return { msg: resultPasswordReset };
    }
    async changePassword(uuid, changePasswordDto) {
        const { currentPassword, userNewPassword } = changePasswordDto;
        await this.dataSource.query(`CALL get_user_password(?, @user_password)`, [
            uuid,
        ]);
        const resultHash = await this.dataSource.query(`SELECT @user_password AS user_password`);
        const hashPassDb = resultHash[0]?.user_password;
        if (!hashPassDb) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const match = await (0, bcryptjs_1.compare)(currentPassword, hashPassDb);
        if (!match) {
            throw new common_1.BadRequestException('La contraseña actual es incorrecta');
        }
        const isSamePassword = await (0, bcryptjs_1.compare)(userNewPassword, hashPassDb);
        if (isSamePassword) {
            throw new common_1.BadRequestException('La nueva contraseña no puede ser igual a la anterior');
        }
        const newHashedPassword = await (0, bcryptjs_1.hash)(userNewPassword, 10);
        await this.dataSource.query(`CALL change_user_password(?, ?, @message)`, [
            uuid,
            newHashedPassword,
        ]);
        const resultUpdatePassword = await this.dataSource.query(`SELECT @message as msg`);
        return { msg: resultUpdatePassword[0]?.msg };
    }
    async changeUserName(uuid, changeUserNameDto) {
        const { userName } = changeUserNameDto;
        try {
            await this.dataSource.query('CALL change_user_name(?, ?, @message)', [
                uuid,
                userName,
            ]);
            const resultUpdateName = await this.dataSource.query('SELECT @message AS msg');
            return { msg: resultUpdateName[0]?.msg };
        }
        catch (error) {
            throw new common_1.HttpException('Error al actualizar el nombre', common_1.HttpStatus.NOT_MODIFIED);
        }
    }
    async changeUserLastName(uuid, changeUserLastNameDto) {
        const { userLastName } = changeUserLastNameDto;
        try {
            await this.dataSource.query('CALL change_user_lastname(?,?, @message)', [
                uuid,
                userLastName,
            ]);
            const resultUpdateLastName = await this.dataSource.query('SELECT @message AS msg');
            return { msg: resultUpdateLastName[0]?.msg };
        }
        catch (error) {
            throw new common_1.HttpException('Error al actualizar el apellido', common_1.HttpStatus.NOT_MODIFIED);
        }
    }
    async changeUserNickName(uuid, changeUserNickNameDto) {
        const { nickName } = changeUserNickNameDto;
        try {
            await this.dataSource.query('CALL change_user_nickname(?, ?, @message)', [
                uuid,
                nickName,
            ]);
            const resultUpdateNickName = await this.dataSource.query('SELECT @message AS msg');
            return { msg: resultUpdateNickName[0]?.msg };
        }
        catch (error) {
            throw new common_1.HttpException('Error al actualizar el nickname', common_1.HttpStatus.NOT_MODIFIED);
        }
    }
    async logout(uuid) {
        console.log('UUID:', uuid);
        try {
            const result = await this.dataSource.query(`DELETE FROM user_session WHERE user_uuid = ?`, [uuid]);
            console.log('Sesiones eliminadas:', result);
            await this.dataSource.query(`CALL increment_token_version(?)`, [uuid]);
        }
        catch (error) {
            throw new common_1.HttpException('Token inválido o expirado', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        email_service_1.EmailService])
], UserService);
//# sourceMappingURL=user.service.js.map