import { Module, forwardRef } from '@nestjs/common';
import { RosetaController } from './controllers/roseta.controller';
import { RosetaService } from './services/roseta.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [RosetaController],
  providers: [RosetaService],
})
export class RosetaModule {}