import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
import { AuthController } from './controllers/auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Secret for access token
      signOptions: { expiresIn: '15m' }, // Expiration for access token
    }),
    JwtModule.register({
      secret: process.env.JWT_REFRESH_SECRET, // Secret for refresh token
      signOptions: { expiresIn: '7d' }, // Expiration for refresh token
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, JwtAuthGuard],
  exports: [AuthService, EmailService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
