import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Reservations - Stol Bron Qilish')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @ApiOperation({ summary: 'Yangi stol bron qilish' })
  @ApiResponse({ status: 201, description: 'Stol muvaffaqiyatli bron qilindi' })
  @ApiResponse({ status: 409, description: 'Ushbu stol kiritilgan vaqtda allaqachon bron qilingan' })
  @Post()
  create(@CurrentUser() user, @Body() dto: CreateReservationDto) {
    return this.reservationsService.create(user.userId, dto);
  }

  @ApiOperation({ summary: 'Tizimga kirgan foydalanuvchining bronlar tarixini olish' })
  @Get('me')
  findMine(@CurrentUser() user) {
    return this.reservationsService.findMyReservations(user.userId);
  }
}

