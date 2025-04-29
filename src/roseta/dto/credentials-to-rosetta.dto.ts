import { IsString } from 'class-validator';

export class CredentialsToRosettaDto {
  @IsString()
  wifi_ssid: string;

  @IsString()
  wifi_password: string;
}

