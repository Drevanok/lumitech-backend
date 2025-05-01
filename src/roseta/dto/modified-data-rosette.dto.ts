import { IsMACAddress, IsNotEmpty, IsString } from "class-validator";

export class ChangeUbicationDto {

  @IsString()
  @IsMACAddress({ message: 'La dirección MAC no es válida.' })
  @IsNotEmpty({ message: 'La dirección MAC no puede estar vacía.'})
  rosette_mac: string;
  
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