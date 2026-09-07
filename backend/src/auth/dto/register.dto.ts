import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Alisher', description: 'Foydalanuvchining ismi' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Navoiy', description: 'Foydalanuvchining familiyasi' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '+998901234567', description: 'Telefon raqami' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'alisher_user', description: 'Unikal foydalanuvchi nomi' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'parol123', description: 'Parol (kamida 6 simvol)' })
  @IsString()
  @MinLength(6)
  password: string;
}

