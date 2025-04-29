import { IsNotEmpty, IsString } from "class-validator";

export class ChangeUbicationDto {
  @IsString()
  @IsNotEmpty({ message: 'La ubicación no puede estar vacía.'})
  ubication: string;
}

export class ChangePasswordDto{
  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.'})
  wifi_ssid: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía.'})
  wifi_password: string;
}