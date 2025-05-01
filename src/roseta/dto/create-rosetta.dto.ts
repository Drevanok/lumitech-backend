import { IsString, IsNotEmpty, IsIP, IsMACAddress, isMACAddress } from 'class-validator';

export class CreateRosettaDto {
    @IsString()
    @IsNotEmpty()
    @IsMACAddress({}, { message: 'La dirección MAC no es válida.' })
    rosette_mac: string;

    @IsString()
    @IsNotEmpty()
    @IsIP('4', { message: 'La dirección IP debe ser IPv4 y no es válida.' })
    rosette_ip: string;

    @IsString()
    @IsNotEmpty()
    wifi_ssid: string;

    @IsString()
    @IsNotEmpty()
    wifi_password: string;
}
