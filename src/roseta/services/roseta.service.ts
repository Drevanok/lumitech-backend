import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as QRCode from 'qrcode';
import { GenerateQrDto } from '../dto/generate-qr.dto';
import * as qrcodeTerminal from 'qrcode-terminal';
import { RegisterRosetaDto } from '../dto/create-roseta.dto';

@Injectable()
export class RosetaService {
  constructor(private readonly dataSource: DataSource) {}

  async generateQRCode(generateQrDto: GenerateQrDto, uuid: string): Promise<{ qrCode: string }> {
    const { wifiSSID, wifiPassword, ubication} = generateQrDto;

    try {
      // Generar el string para el código QR con SSID, contraseña, ubicación y UUID
      const wifiString = `${wifiSSID},${wifiPassword}, ${ubication},${uuid}`;

      console.log(wifiString);
      // Generar e imprimir el código QR en la consola
      qrcodeTerminal.generate(wifiString, { small: true });

      // Generar el código QR en formato base64 (si lo necesitas para retornarlo)
      const qrCodeDataURL = await QRCode.toDataURL(wifiString);

      // Retornar el QR como una cadena base64
      return { qrCode: qrCodeDataURL };
    } catch (error) {
      console.error('Error al generar el QR:', error);
      throw new InternalServerErrorException('Error al generar el código QR.');
    }
  }

  async registerRoseta(registerRosetaDto: RegisterRosetaDto): Promise<{ message: string }> {
    const {ubication,  macAddress, wifiSSID, wifiPassword, uuid} = registerRosetaDto;

    try {
      // Ejecutar el procedimiento almacenado 'register_rosette
      await this.dataSource.query('CALL register_rosette(?, ?, ?, ?, ?, @p_message)', [
        ubication,
        macAddress,
        wifiSSID,
        wifiPassword,
        uuid,
      ]);

      // Obtener el mensaje de salida del procedimiento almacenado
      const result = await this.dataSource.query('SELECT @p_message AS message');
      console.log(result[0].message);
      return {message: result[0].message};

    } catch (error) {
      console.error('Error al registrar la roseta:', error);
      throw new InternalServerErrorException('Error al registrar la roseta.');
    }
  }
}
