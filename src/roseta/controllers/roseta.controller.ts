import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RosetaService } from '../services/roseta.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
//import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { JwtPayload } from 'jsonwebtoken';
import { CreateRosettaDto } from '../dto/create-rosetta.dto';
import { ReceivedDataRosettaDto } from '../dto/received-data.dto';
import { ReceivedIpRosettaDto } from '../dto/received-ip-roseta..dto';

@Controller('roseta')
export class RosetaController {
  constructor(private readonly rosetaService: RosetaService) {}

  @Post('received-ip')
  @HttpCode(HttpStatus.OK)
  async receivedIP(@Body() receivedIpRosettaDto: ReceivedIpRosettaDto) {
    console.log('Ip:', receivedIpRosettaDto);
    return await this.rosetaService.receivedIPRosetta(receivedIpRosettaDto);
  }

  @Post('send-uuid')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async sendUUID(@Req() req: {user: JwtPayload}) {
    const userUuid = req.user.uuid;
    return await this.rosetaService.sendUUID(userUuid);
  }

  @Post('received-data')
  @HttpCode(HttpStatus.OK)
  async receivedData(
    @Body() receivedDataRosettaDto: ReceivedDataRosettaDto,
  ): Promise<{ msg: string }> {
    return await this.rosetaService.receivedDataRosetta(receivedDataRosettaDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerRosetta(@Body() createRosettaDto: CreateRosettaDto) {
    return await this.rosetaService.registerRosetta(createRosettaDto);
  }
}
