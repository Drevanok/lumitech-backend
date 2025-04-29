import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class VerifyEmailTokenDto {
  @IsString({message: "El token debe ser una cadena de texto."})
  @IsNotEmpty({ message: 'El token no puede estar vacío.' })
  @IsUUID('4', {
    message: 'El token no es válido.',
  })
  token: string;
}