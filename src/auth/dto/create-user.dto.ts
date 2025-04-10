import {
    IsString,
    IsEmail,
    Length,
    IsNotEmpty,
    Matches,
  } from 'class-validator';
  
  export class CreateUserDto {
    @IsString()
    @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres.' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    user_name: string;
  
    @IsString()
    @Length(3, 50, { message: 'El apellido debe tener entre 3 y 50 caracteres.' })
    @IsNotEmpty({ message: 'El apellido no puede estar vacío.' })
    user_last_name: string;
  
    @IsString()
    @Length(3, 15, { message: 'El nickname debe tener entre 3 y 15 caracteres.' })
    @IsNotEmpty({ message: 'El nickname no puede estar vacío.' })
    user_nickname: string;
  
    @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
    @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío.' })
    user_email: string;
  
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
  