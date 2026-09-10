import { IsString, IsNotEmpty, IsNumber, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Chicken soup', description: 'Taom nomi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Spicy with garlic', description: 'Taom haqida ta\'rif' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 10.0, description: 'Taom narxi' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: '/images/food2.png', description: 'Taom rasmi URL manzili' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: 1, description: 'Tegishli kategoriya ID si' })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ example: 'Birinchi taomlar', description: 'Kategoriya nomi' })
  @IsString()
  @IsOptional()
  categoryName?: string;
}
