import { IsString, Length, IsNotEmpty, Matches, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'El token no puede estar vacío.' })
  @IsUUID('4', {
    message: 'El token no es válido.',
  })
  token: string;
  
  @IsString()
  @Length(8, 15, {
    message: 'La contraseña debe tener entre 8 y 15 caracteres.',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo.',
  })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
  userNewPassword: string;
}
