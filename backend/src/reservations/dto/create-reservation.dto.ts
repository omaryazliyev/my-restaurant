import { IsString, IsNotEmpty, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: '+998901234567', description: 'Mijoz telefon raqami' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 4, description: 'Mehmonlar soni' })
  @IsInt()
  guests: number;

  @ApiProperty({ example: 1, description: 'Tanlangan stol ID si' })
  @IsInt()
  tableId: number;

  @ApiProperty({ example: '2026-09-10', description: 'Bron qilish sanasi' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '2026-09-10T18:00:00.000Z', description: 'Bron qilish soati (ISO vaqt formati)' })
  @IsDateString()
  startTime: string;
}

