import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateRosettaDto } from '../dto/create-rosetta.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ReceivedIpRosettaDto } from '../dto/received-ip-roseta..dto';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

let ip_rosetta ='';

@Injectable()
export class RosetaService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService,
  ) {}

  //method to receive the IP from the rosette dinamically and store it in a variable ip_rosetta
  async receivedIPRosetta(
    receivedIpRosettaDto: ReceivedIpRosettaDto,
  ): Promise<{ msg: string }> {
    const { rossette_ip } = receivedIpRosettaDto;
    console.log('IP recibida en el backend:', rossette_ip);

    ip_rosetta = rossette_ip;
    console.log('IP de la roseta guardada:', ip_rosetta);
    return { msg: 'IP de la roseta recibida correctamente' };
  }

  //this method is used to register the rosetta in the database
  async registerRosetta(uuid: string): Promise<{ msg: string }> {
    try {
      const apiUrl = `http://${ip_rosetta}/send-data`;

      const response = await lastValueFrom(this.httpService.get(apiUrl));
      const dataFromEsp32 = response.data;

      //console.log('Datos recibidos del ESP32:', dataFromEsp32);

      // validate the data received from ESP32 using class-validator
      const dtoInstance = plainToInstance(CreateRosettaDto, dataFromEsp32);
      const errors = validateSync(dtoInstance);

      if (errors.length > 0) {
        console.log('Errores de validación:', errors);
        throw new BadRequestException(
          'Los datos recibidos del ESP32 no son válidos.',
        );
      }

      const { rosette_mac, rosette_ip, wifi_ssid, wifi_password } = dtoInstance;

      await this.dataSource.query(
        'CALL register_rosette(?, ?, ?, ?, ?, @p_message)',
        [rosette_mac, rosette_ip, wifi_ssid, wifi_password, uuid],
      );

      const result = await this.dataSource.query(
        'SELECT @p_message as message',
      );

      return { msg: result[0].message };
    } catch (error) {
      console.log('Error al registrar la roseta:', error);
      throw new InternalServerErrorException('Error al registrar la roseta.');
    }
  }
}
