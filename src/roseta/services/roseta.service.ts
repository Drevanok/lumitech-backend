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
import { ChangeUbicationDto } from '../dto/modified-data-rosette.dto';
import { Rosetta } from '../interface/rosetta.interface';

//Variable to store the IP of the rosette
let ipRosette ='';

@Injectable()
export class RosetaService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService,
  ) {}

  //service to receive the IP from the rosette dinamically and store it in a variable ip_rosetta
  async receivedIPRosetta(
    receivedIpRosettaDto: ReceivedIpRosettaDto,
  ): Promise<{ msg: string }> {
    const { rossette_ip } = receivedIpRosettaDto;
    console.log('IP recibida en el backend:', rossette_ip);

    ipRosette = rossette_ip;
    console.log('IP de la roseta guardada:', ipRosette);
    return { msg: 'IP de la roseta recibida correctamente' };
  }

  //service is used to register the rosetta in the database
  async registerRosetta(uuid: string): Promise<{ msg: string }> {
    try {
      const apiUrl = `http://${ipRosette}/send-data`;

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

  //service to get all the rosettes of the user
  async getAllRosettes(uuid: string): Promise<{ msg: string; data: Rosetta[] }> {
    try {
      const result = await this.dataSource.query(
        'CALL get_rosettes_by_user(?)',
        [uuid],
      );
  
      return {
        msg: 'Rosetas obtenidas correctamente',
        data: result[0],
      };
    } catch (error) {
      console.error('Error al obtener las rosetas del usuario:', error);
      throw new InternalServerErrorException('Error al obtener las rosetas del usuario.');
    }
  }

  //service to change the ubication of the rosette
  async changeUbication(
    changeUbicationDto: ChangeUbicationDto,
    uuid: string,
  ): Promise<{ msg: string }> {
    const { ubication, rosette_mac } = changeUbicationDto;
  
    try {
      await this.dataSource.query(
        'CALL change_rosette_ubication(?, ?, ?, @p_message)',
        [ubication, uuid, rosette_mac],
      );
  
      const result = await this.dataSource.query('SELECT @p_message as message');
      const message = result[0]?.message;
  
      if (message === 'Ubicación de roseta actualizada exitosamente') {
        return { msg: message };
      } else {
        throw new BadRequestException(message || 'No se pudo actualizar la ubicación.');
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al cambiar la ubicación de la roseta.');
    }
  }

  //service remove device for user
  async removeRosette(mac: string, uuid: string): Promise<{msg: string}> {
   
    try {
      await this.dataSource.query(
        'CALL delete_rosette_for_user(?, ?, @p_message)',
      [uuid, mac]);

      const result = await this.dataSource.query(
        'SELECT @p_message as message',
      );

      return { msg: result[0].message };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error interno al intentar eliminar esta roseta.');
    }
  }
}
