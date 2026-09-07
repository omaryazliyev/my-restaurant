import { Controller, Get, Query } from '@nestjs/common';
import { TablesService } from './tables.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tables - Restoran Stollari')
@Controller('tables')
export class TablesController {
  constructor(private tablesService: TablesService) {}

  @ApiOperation({ summary: 'Barcha stollar ro\'yxatini olish' })
  @Get()
  findAll() {
    return this.tablesService.findAll();
  }

  @ApiOperation({ summary: 'Stollarning berilgan sana va vaqtdagi bandlik xaritasini olish' })
  @ApiQuery({ name: 'date', example: '2026-09-10', description: 'Sana (YYYY-MM-DD)' })
  @ApiQuery({ name: 'time', example: '18:00', description: 'Vaqt (HH:mm)' })
  @ApiResponse({ status: 200, description: 'Stollar ro\'yxati har birining statusi bilan (free, busyThisHour, busyThisDay)' })
  @Get('availability')
  findAvailability(@Query('date') date: string, @Query('time') time: string) {
    return this.tablesService.findAvailability(date, time);
  }
}

