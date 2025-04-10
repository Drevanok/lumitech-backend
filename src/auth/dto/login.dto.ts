import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  ValidateIf,
  IsNotEmpty,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'eitherEmailOrNickname', async: false })
class EitherEmailOrNicknameConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return !!(obj.email || obj.nickname);
  }

  defaultMessage() {
    return 'Debes proporcionar al menos el email o el nickname.';
  }
}

export class LoginDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'El nickname debe tener al menos 3 caracteres.' })
  nickname?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;

  @Validate(EitherEmailOrNicknameConstraint)
  checkEitherEmailOrNickname: boolean;
}
