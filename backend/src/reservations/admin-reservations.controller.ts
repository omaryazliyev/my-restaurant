import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Admin Reservations - Bronlarni Boshqarish')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/reservations')
export class AdminReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  @ApiOperation({ summary: 'Barcha bronlar ro\'yxatini olish (Faqat Admin)' })
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @ApiOperation({ summary: 'Bron holatini (PENDING, CONFIRMED, CANCELLED) o\'zgartirish (Faqat Admin)' })
  @ApiParam({ name: 'id', example: 1, description: 'Bron ID si' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', example: 'CONFIRMED', enum: ['PENDING', 'CONFIRMED', 'CANCELLED'] } } } })
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'PENDING' | 'CONFIRMED' | 'CANCELLED',
  ) {
    return this.reservationsService.updateStatus(id, status);
  }
}

