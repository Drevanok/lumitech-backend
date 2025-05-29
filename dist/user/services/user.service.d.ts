import { DataSource } from 'typeorm';
import { EmailService } from '../../auth/services/email.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ChangePasswordDto, ChangeUserLastNameDto, ChangeUserNickNameDto, ChangeUserNameDto } from '../dto/modified-data-user.dto';
import { UserInfo } from '../../auth/interfaces/user-info.interface';
import { VerifyEmailTokenDto } from '../dto/verify-email-token.dto';
export declare class UserService {
    private readonly dataSource;
    private readonly emailService;
    constructor(dataSource: DataSource, emailService: EmailService);
    createUser(createUserDto: CreateUserDto): Promise<void>;
    confirmUserEmail(verifyEmailTokenDto: VerifyEmailTokenDto): Promise<{
        msg: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        msg: string;
    }>;
    getUserProfile(uuid: string): Promise<UserInfo>;
    forgetPassword(email: string): Promise<{
        msg: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        msg: string;
    }>;
    changePassword(uuid: string, changePasswordDto: ChangePasswordDto): Promise<{
        msg: string;
    }>;
    changeUserName(uuid: string, changeUserNameDto: ChangeUserNameDto): Promise<{
        msg: string;
    }>;
    changeUserLastName(uuid: string, changeUserLastNameDto: ChangeUserLastNameDto): Promise<{
        msg: string;
    }>;
    changeUserNickName(uuid: string, changeUserNickNameDto: ChangeUserNickNameDto): Promise<{
        msg: string;
    }>;
    logout(uuid: string): Promise<void>;
}
