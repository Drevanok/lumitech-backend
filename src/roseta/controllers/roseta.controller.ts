import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { RosetaService } from '../services/roseta.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JwtPayload } from 'jsonwebtoken';
import { ReceivedIpRosettaDto } from '../dto/received-ip-roseta..dto';
import { FirebaseService } from '../../firebase/services/firebase.service';
import { ChangeUbicationDto } from '../dto/modified-data-rosette.dto';

@Controller('roseta')
export class RosetaController {
  constructor(
    private readonly rosetaService: RosetaService,
    private readonly fireBaseService: FirebaseService,
  ) {}

  // Endpoint to receive the IP from the rosette
  @Post('received-ip')
  @HttpCode(HttpStatus.OK)
  async receivedIP(@Body() receivedIpRosettaDto: ReceivedIpRosettaDto) {
    console.log('Ip:', receivedIpRosettaDto);
    return await this.rosetaService.receivedIPRosetta(receivedIpRosettaDto);
  }

  //Endpoint to register the rosette
  @Post('register')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async registerRosetta(@Req() req: { user: JwtPayload }) {
    const userUuid = req.user.uuid;
    return await this.rosetaService.registerRosetta(userUuid);
  }

  //Endpoint to get all the rosettes of the user
  @Get('get-all-rosettes')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllRosettes(@Req() req: { user: JwtPayload }) {
    const userUuid = req.user.uuid;
    return await this.rosetaService.getAllRosettes(userUuid);
  }

  // Endpoint to receive data from ESP32 and send it to Firebase
  @Post('sensor-data')
  async recibirDatosDesdeESP32(@Body() data: any) {
    console.log('Datos recibidos del ESP32:', data);

    try {
      await this.fireBaseService.sendSensorData(data);
      return { msg: 'Datos recibidos y enviados a Firebase correctamente' };
    } catch (error) {
      return { msg: 'Error al enviar los datos a Firebase' };
    }
  }

  //Endpoint to get the information of the sensor
  @Get('sensor/:mac')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getInfoSensor(@Param('mac') mac: string) {
    return await this.fireBaseService.getInfoSensor(mac);
  }

  //Endpoint to get the alerts of the sensor
  @Get('alerts/:mac')
  @UseGuards(JwtAuthGuard)
  async getAlerts(@Param('mac') mac: string) {
    const alertData = await this.fireBaseService.getAlert(mac);

    if (!alertData) {
      return {
        msg: 'No se encontraron alertas para la roseta con MAC: ' + mac,
        data: null,
      };
    }

    return alertData;
  }

  //Endpoint to get the ubication of the rosettes
  @Post('change-ubication')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changeUbication(
    @Body() changeUbicationDto: ChangeUbicationDto,
    @Req() req: { user: JwtPayload },
  ) {
    const userUuid = req.user.uuid;
    return await this.rosetaService.changeUbication(
      changeUbicationDto,
      userUuid,
    );
  }
}
