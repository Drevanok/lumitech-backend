import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module'; // Asegúrate de importar UserModule
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { ConfirmEmailController } from './controllers/confirm-email.controller';
import { EmailService } from './services/email.service';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController, ConfirmEmailController],
  providers: [AuthService, EmailService, JwtAuthGuard],
  exports: [AuthService, EmailService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
