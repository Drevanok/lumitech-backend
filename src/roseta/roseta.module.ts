import { Module, forwardRef } from '@nestjs/common';
import { RosetaController } from './controllers/roseta.controller';
import { RosetaService } from '../roseta/services/roseta.service';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, forwardRef(() => AuthModule)],
  controllers: [RosetaController],
  providers: [RosetaService],
})
export class RosetaModule {}