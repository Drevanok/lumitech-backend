import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ChangePasswordDto, ChangeUserLastNameDto, ChangeUserNickNameDto, ChangeUserNameDto } from '../dto/modified-data-user.dto';
import { JwtPayload } from 'jsonwebtoken';
import { VerifyEmailTokenDto } from '../dto/verify-email-token.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
    }>;
    confirmEmail(verifyEmailTokenDto: VerifyEmailTokenDto): Promise<{
        msg: string;
    }>;
    resendVerification(email: string): Promise<{
        msg: string;
    }>;
    getProfile(req: {
        user: JwtPayload;
    }): Promise<{
        user: import("../../auth/interfaces/user-info.interface").UserInfo;
    }>;
    forgetPassword(email: string): Promise<{
        msg: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        msg: string;
    }>;
    changePassword(req: {
        user: JwtPayload;
    }, changePasswordDto: ChangePasswordDto): Promise<{
        msg: string;
    }>;
    changeUserName(req: {
        user: JwtPayload;
    }, changeUserNameDto: ChangeUserNameDto): Promise<{
        msg: string;
    }>;
    changeUserLastname(req: {
        user: JwtPayload;
    }, changeUserLastnameDto: ChangeUserLastNameDto): Promise<{
        msg: string;
    }>;
    changeNickName(req: {
        user: JwtPayload;
    }, changeUserNickNameDto: ChangeUserNickNameDto): Promise<{
        msg: string;
    }>;
    logout(req: Request & {
        user: JwtPayload;
    }, res: Response): Promise<{
        message: string;
    }>;
}
