import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'alisher_user', description: 'Foydalanuvchi nomi' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'parol123', description: 'Foydalanuvchi paroli' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

