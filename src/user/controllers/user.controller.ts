import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  Req,
  Get,
  Request,
  Patch,
} from '@nestjs/common';

import { UserService } from '../services/user.service';
import { CreateUserDto } from '../../auth/dto/create-user.dto';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ChangePasswordDto,
  ChangeUserLastNameDto,
  ChangeUserNickNameDto,
} from 'src/auth/dto/modified-data-user.dto';
import { JwtPayload } from 'jsonwebtoken';
import { ChangeUserNameDto } from 'src/auth/dto/modified-data-user.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { userInfo } from 'src/auth/interfaces/user-info.interface';

@Controller('user') // Prefix route
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register') // Route register user
  @HttpCode(HttpStatus.CREATED) // Return code 201 if response is successful
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.userService.createUser(createUserDto);
    return { message: 'Usuario registrado correctamente' };
  }

  @Get('verify/:token')
  @HttpCode(HttpStatus.OK) //Return code 200 if response is successful
  async confirmEmail(@Param('token') token: string) {
    return await this.userService.confirmUserEmail(token);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(
    @Body('email') email: string
    ):Promise<{msg: string}>{
      return this.userService.resendVerificationEmail(email);
    };

  //after auth/login in authService and authController.
  //get profile user authenticate in login
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req: any){
    const uuid = req.user.uuid;
    const user = await this.userService.getUserProfile(uuid);

    return {
      user,
    };
  }

  //recover password with email
  @Post('forget-password')
  async forgetPassword(@Body('email') email: string) {
    return this.userService.forgetPassword(email);
  }

  //save new password with token recover password
  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ msg: string }> {
    return this.userService.resetPassword(token, resetPasswordDto);
  }

  //user auth service change password
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Req() req: { user: JwtPayload },
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const uuid = req.user.uuid;
    return this.userService.changePassword(uuid, changePasswordDto);
  }
  
  //user auth service change name
  @Patch('change-name')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changeUserName(
    @Req() req: { user: JwtPayload },
    @Body() changeUserNameDto: ChangeUserNameDto,
  ) {
    const uuid = req.user.uuid;
    return this.userService.changeUserName(uuid, changeUserNameDto);
  }

  //user auth service change last name
  @Patch('change-lastname')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changeUserLastname(
    @Req() req: { user: JwtPayload },
    @Body() changeUserLastnameDto: ChangeUserLastNameDto,
  ) {
    const uuid = req.user.uuid;
    return this.userService.changeUserLastName(uuid, changeUserLastnameDto);
  }

  @Patch('change-nickname')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changeNickName(
    @Req() req: {user: JwtPayload},
    @Body() changeUserNickNameDto: ChangeUserNickNameDto,
  ){
    const uuid = req.user.uuid;
    return this.userService.changeUserNickName(uuid, changeUserNickNameDto);
  }
}
