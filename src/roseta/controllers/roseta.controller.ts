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
import { RegisterRosetaDto } from '../dto/create-roseta.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { JwtPayload } from 'jsonwebtoken'
import { GenerateQrDto } from '../dto/generate-qr.dto';

@Controller('roseta')
export class RosetaController {
  constructor(private readonly rosetaService: RosetaService) {}

@Post('pre-register')
@UseGuards(JwtAuthGuard)
@HttpCode(HttpStatus.OK)
async generateQr(
  @Body() generateQrDto: GenerateQrDto,
  @Req() req: { user: JwtPayload },
){
  const uuid = req.user.uuid;  // Obtienes el UUID del usuario
  return this.rosetaService.generateQRCode(
    generateQrDto,
    uuid,
  );
}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerRoseta(@Body() registerRosetaDto: RegisterRosetaDto) {
    return this.rosetaService.registerRoseta(registerRosetaDto);
  }
}

