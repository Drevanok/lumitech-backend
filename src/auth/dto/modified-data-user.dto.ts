import {
    IsString,
    Length,
    IsNotEmpty,
    Matches,
  } from 'class-validator';

//validator change user name
export class ChangeUserNameDto {

    @IsString()
    @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres.' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @Matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,50}$/, {
      message: 'El nombre solo puede contener letras y espacios.',
    })
    userName: string;
  
};

//validator change user last name
export class ChangeUserLastNameDto {
    @IsString()
    @Length(3, 50, { message: 'El apellido debe tener entre 3 y 50 caracteres.' })
    @IsNotEmpty({ message: 'El apellido no puede estar vacío.' })
    @Matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{3,50}$/, {
      message: 'El apellido solo puede contener letras y espacios.',
    })
    userLastName: string;
}


//validator change user password
export class ChangePasswordDto {

  @IsString()
  @IsNotEmpty()
  currentPassword: string;

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

