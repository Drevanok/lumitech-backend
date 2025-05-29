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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const create_user_dto_1 = require("../dto/create-user.dto");
const reset_password_dto_1 = require("../dto/reset-password.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const modified_data_user_dto_1 = require("../dto/modified-data-user.dto");
const verify_email_token_dto_1 = require("../dto/verify-email-token.dto");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async register(createUserDto) {
        await this.userService.createUser(createUserDto);
        return { message: 'Usuario registrado correctamente' };
    }
    async confirmEmail(verifyEmailTokenDto) {
        return await this.userService.confirmUserEmail(verifyEmailTokenDto);
    }
    async resendVerification(email) {
        return this.userService.resendVerificationEmail(email);
    }
    async getProfile(req) {
        const uuid = req.user.uuid;
        const user = await this.userService.getUserProfile(uuid);
        return {
            user,
        };
    }
    async forgetPassword(email) {
        return this.userService.forgetPassword(email);
    }
    async resetPassword(resetPasswordDto) {
        return this.userService.resetPassword(resetPasswordDto);
    }
    async changePassword(req, changePasswordDto) {
        const uuid = req.user.uuid;
        return this.userService.changePassword(uuid, changePasswordDto);
    }
    async changeUserName(req, changeUserNameDto) {
        const uuid = req.user.uuid;
        return this.userService.changeUserName(uuid, changeUserNameDto);
    }
    async changeUserLastname(req, changeUserLastnameDto) {
        const uuid = req.user.uuid;
        return this.userService.changeUserLastName(uuid, changeUserLastnameDto);
    }
    async changeNickName(req, changeUserNickNameDto) {
        const uuid = req.user.uuid;
        return this.userService.changeUserNickName(uuid, changeUserNickNameDto);
    }
    async logout(req, res) {
        const uuid = req.user.uuid;
        await this.userService.logout(uuid);
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return { message: 'Sesión cerrada correctamente.' };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_email_token_dto_1.VerifyEmailTokenDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "confirmEmail", null);
__decorate([
    (0, common_1.Post)('resend-verification'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resendVerification", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('forget-password'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgetPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Patch)('change-password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, modified_data_user_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Patch)('change-name'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, modified_data_user_dto_1.ChangeUserNameDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeUserName", null);
__decorate([
    (0, common_1.Patch)('change-lastname'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, modified_data_user_dto_1.ChangeUserLastNameDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeUserLastname", null);
__decorate([
    (0, common_1.Patch)('change-nickname'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, modified_data_user_dto_1.ChangeUserNickNameDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeNickName", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map