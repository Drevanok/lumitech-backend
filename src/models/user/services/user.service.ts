import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { user_name, user_last_name, user_nickname, user_email, user_password } = createUserDto;

    //verify user already exist
    await this.dataSource.query(
      'CALL validate_user(?, ?, @p_result)',
      [user_nickname, user_email]
    );

    const result = await this.dataSource.query('SELECT @p_result as result');
    const message = result[0].result;
    
    if(message !== 'VALID'){
      throw new BadRequestException(message)
    }

    //Hash password
    const hashedPassword = await hash(user_password, 10);
    const verificationToken = uuidv4();

    
    await this.dataSource.query(
      'CALL register_user(?, ?, ?, ?, ?, ?)', 
      [user_name, user_last_name, user_nickname, user_email, hashedPassword, verificationToken]
    );
  }
}