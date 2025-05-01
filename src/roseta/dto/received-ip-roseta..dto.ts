import { IsIP, IsNotEmpty, IsString } from "class-validator";

export class ReceivedIpRosettaDto {
    
    @IsString()
    @IsNotEmpty()
    @IsIP('4', { message: 'La dirección IP debe ser IPv4 y no es válida.' })
    rossette_ip: string;
}