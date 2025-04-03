import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('user') // Prefix route
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register') // Route register user
    @HttpCode(HttpStatus.CREATED) // Return code 201 if response is successful
    async register(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
        await this.userService.createUser(createUserDto);
        return { message: 'Usuario registrado correctamente' }; 
    }
}
