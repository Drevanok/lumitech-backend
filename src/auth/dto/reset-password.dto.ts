import {
    IsString,
    Length,
    IsNotEmpty,
    Matches,
  } from 'class-validator';
  
  export class ResetPasswordDto {

        @IsString()
        @Length(8, 15, {
          message: 'La contraseña debe tener entre 8 y 15 caracteres.',
        })
        @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
          message:
            'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo.',
        })
        @IsNotEmpty({ message: 'La contraseña no puede estar vacía.' })
        user_password: string;
  }