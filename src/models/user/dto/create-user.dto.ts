import { IsString, IsEmail, Length, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    user_name: string;

    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    user_last_name: string;

    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    user_nickname: string;

    @IsEmail()
    @IsNotEmpty()
    user_email: string;

    @IsString()
    @Length(6, 12)
    @IsNotEmpty()
    user_password: string;
}
