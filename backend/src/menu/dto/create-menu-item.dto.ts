import { IsString, IsNotEmpty, IsNumber, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Chicken soup', description: 'Taom nomi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Spicy with garlic', description: 'Taom haqida ta\'rif' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 10.0, description: 'Taom narxi ($)' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: '/images/food2.png', description: 'Taom rasmi URL manzili' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 1, description: 'Tegishli kategoriya ID si' })
  @IsInt()
  categoryId: number;
}

