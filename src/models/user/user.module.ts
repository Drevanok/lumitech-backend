import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { EmailService } from './services/email/email.service';
import { ConfirmEmailController } from './controllers/confirm-email.controller';

@Module({
    controllers: [UserController, ConfirmEmailController],
    providers: [UserService, EmailService],
    exports: [UserService],
})
export class UserModule {}
