import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateRosettaDto } from '../dto/create-rosetta.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ReceivedDataRosettaDto } from '../dto/received-data.dto';
import { ReceivedIpRosettaDto } from '../dto/received-ip-roseta..dto';

let ip_rosetta = '';
let mac_rosetta = '';
let ssdi_wifi = '';
let password_wifi = '';
let owner_uuid = '';

@Injectable()
export class RosetaService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService
  ) {}


  async receivedIPRosetta(receivedIpRosettaDto: ReceivedIpRosettaDto): Promise<{ msg: string }> {
    const {rossette_ip} = receivedIpRosettaDto;
    console.log('IP recibida en el backend:', rossette_ip);

    ip_rosetta = rossette_ip
    console.log('IP de la roseta guardada:', ip_rosetta);
    return { msg: 'IP de la roseta recibida correctamente' };
  }

  async sendUUID(uuid: string): Promise<{ msg: string }> {
    
    try {
      
      const apiUrl = `http://${ip_rosetta}/set-uuid`;  //url ESP32 dinamic

      const response = await lastValueFrom(
        this.httpService.post(apiUrl, { uuid }) //send uuid to ESP32
      );

      //check response ESP32
      console.log("Respuesta del ESP32:", response.data);

      return { msg: 'UUID enviado correctamente' };

    } catch (error) {
      console.log('Error al enviar el UUID al ESP32:', error);
      throw new InternalServerErrorException('Error al enviar el UUID al ESP32');
    }
  }

  async receivedDataRosetta(receivedDataRosettaDto: ReceivedDataRosettaDto): Promise<{ msg: string }> {
    const { rosette_mac, wifi_ssid, wifi_password, uuid_owner} = receivedDataRosettaDto

    mac_rosetta = rosette_mac
    ssdi_wifi = wifi_ssid
    password_wifi = wifi_password
    owner_uuid = uuid_owner
    console.log('Datos recibidos en el backend:', rosette_mac, wifi_ssid, wifi_password, uuid_owner);
    console.log('Datos guardados:', mac_rosetta, ssdi_wifi, password_wifi, owner_uuid);
    return { msg: 'Datos recibidos correctamente' };
  }

  async registerRosetta(
    createRosettaDto: CreateRosettaDto,
  ): Promise<{ msg: string }> {
    const { rosette_mac, wifi_ssid, wifi_password} =
      createRosettaDto;

    try {
      await this.dataSource.query(
        'CALL register_rosette(?, ?, ?, ?, @p_message)',
        [rosette_mac, wifi_ssid, wifi_password],
      );

      const result = await this.dataSource.query(
        'SELECT @p_message as message',
      );
      console.log(result[0].message);
      return { msg: result[0].message };
    } catch (error) {
      console.log('Error al registrar la roseta:', error);
      throw new InternalServerErrorException('Error al registrar la roseta.');
    }
  }
}
