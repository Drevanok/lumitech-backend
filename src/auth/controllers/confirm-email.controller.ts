import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';

@Controller('user')
export class ConfirmEmailController {
  constructor(private readonly userService: UserService) {}

  @Get('verify/:token')
  @HttpCode(HttpStatus.OK) //Return code 200 if response is successful
  async confirmEmail(@Param('token') token: string) {
    return await this.userService.confirmUserEmail(token);
  }
}
