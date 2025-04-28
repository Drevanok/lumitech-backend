import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class RegisterRosetaDto {
  @IsString()
  @IsOptional()
  ubication: string;

  @IsString()
  @IsNotEmpty()
  macAddress: string;

  @IsString()
  @IsNotEmpty()
  wifiSSID: string;

  @IsString()
  @IsNotEmpty()
  wifiPassword: string;

  @IsUUID()
  uuid: string;
}
