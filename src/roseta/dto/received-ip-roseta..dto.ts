import { IsNotEmpty, IsString } from "class-validator";

export class ReceivedIpRosettaDto {
    
    @IsString()
    @IsNotEmpty()
    rossette_ip: string;
}