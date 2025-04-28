import { IsString, IsNotEmpty, IsUUID} from 'class-validator';

export class CreateRosettaDto {
    @IsString()
    @IsNotEmpty()
    rosette_mac: string;

    @IsString()
    @IsNotEmpty()
    wifi_ssid: string;

    @IsString()
    @IsNotEmpty()
    wifi_password: string;

    @IsNotEmpty()
    uuid_owner: string;
  }

  