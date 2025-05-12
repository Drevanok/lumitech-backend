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
import { CreateUserDto } from '../dto/create-user.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ChangePasswordDto,
  ChangeUserLastNameDto,
  ChangeUserNickNameDto,
  ChangeUserNameDto
} from '../dto/modified-data-user.dto';
import { JwtPayload } from 'jsonwebtoken';
import { VerifyEmailTokenDto } from '../dto/verify-email-token.dto';

@Controller('user') // Prefix route
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  //Endpoit to register a user
  @Post('register') // Route register user
  @HttpCode(HttpStatus.CREATED) // Return code 201 if response is successful
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.userService.createUser(createUserDto);
    return { message: 'Usuario registrado correctamente' };
  }

  //Endpoint to verify email
  @Post('verify-email')
  @HttpCode(HttpStatus.OK) //Return code 200 if response is successful
  async confirmEmail(@Body() verifyEmailTokenDto: VerifyEmailTokenDto) { 
    return await this.userService.confirmUserEmail(verifyEmailTokenDto);
  }

  //Endpoint to resend verification email
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(
    @Body('email') email: string
    ):Promise<{msg: string}>{
      return this.userService.resendVerificationEmail(email);
    };

  //Endpoint to get user by uuid
  //after auth/login in authService and authController.
  //get profile user authenticate in login
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req: { user: JwtPayload }) {
    const uuid = req.user.uuid;
    const user = await this.userService.getUserProfile(uuid);
    return {
      user,
    };
  }


  //Endpoint recover password with email
  @Post('forget-password')
  async forgetPassword(@Body('email') email: string) {
    return this.userService.forgetPassword(email);
  }

  //Endpoint save new password with token recover password
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ){
    return this.userService.resetPassword(resetPasswordDto);
  }

  //Endpoint user auth service change password
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
  
  //Endpoint user auth service change name
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

  //Endpoint user auth service change last name
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


  //Endpoint user auth service change nickname
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

  //Endpoint use auth service logout
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: {user: JwtPayload}): Promise<{message: string}>{
    const uuid = req.user.uuid;
    await this.userService.logout(uuid);
    return {message: 'Sesión cerrada exitosamente.'}
  }
}
