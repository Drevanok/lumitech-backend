import { IsString, IsEmail, Length, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @Length(3, 30)
    @IsNotEmpty()
    user_name: string;

    @IsString()
    @Length(3, 30)
    @IsNotEmpty()
    user_last_name: string;

    @IsString()
    @Length(3, 20)
    @IsNotEmpty()
    user_nickname: string;

    @IsEmail()
    @IsNotEmpty()
    user_email: string;

    @IsString()
    @Length(6, 15)
    @IsNotEmpty()
    user_password: string;
}
