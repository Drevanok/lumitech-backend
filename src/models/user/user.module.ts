import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { EmailService } from './services/email/email.service';
import { ConfirmEmailController } from './controllers/confirm-email.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service'; 

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    TypeOrmModule,
  ],
  controllers: [
    UserController,
    ConfirmEmailController,
    AuthController,  
  ],
  providers: [
    UserService,
    EmailService,
    AuthService, 
  ],
  exports: [UserService, JwtModule],
})
export class UserModule {}
