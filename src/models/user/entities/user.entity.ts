import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column()
    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    user_name: string;

    @Column()
    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    user_last_name: string;

    @Column({ unique: true })
    @IsString()
    @Length(3, 50)
    @IsNotEmpty()
    user_nickname: string;

    @Column({ unique: true })
    @IsEmail()
    @IsNotEmpty()
    user_email: string;

    @Column()
    @IsString()
    @Length(6, 12)
    @IsNotEmpty()
    user_password: string;

    @Column({ type: 'uuid', unique: true })
    uuid: string;

    @Column({ default: false })
    verified: boolean;

    @Column({ nullable: true, type: 'text' })
    token_verification: string | null;
}
