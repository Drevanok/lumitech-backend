import { IsString, Length } from "class-validator";

export class GenerateQrDto {

    @IsString()
    @Length(4, 30, { message: 'La ubicacion debe contener al menos 4 a 30 caracteres.' })
    ubication: string;
    
    @IsString()
    wifiSSID: string;

    @IsString()
    wifiPassword: string;
}
