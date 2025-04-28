// login.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsNotEmpty,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'eitherEmailOrNickName', async: false })
class EitherEmailOrNickNameConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return !!(obj.email || obj.nickName);
  }

  defaultMessage() {
    return 'Debes proporcionar al menos el email o el nickName.';
  }
}

export class LoginDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'El nickName debe tener al menos 3 caracteres.' })
  nickName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;

  @Validate(EitherEmailOrNickNameConstraint)
  checkEitherEmailOrNickName: boolean;
}
