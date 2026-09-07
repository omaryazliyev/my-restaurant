import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Admin Orders - Buyurtmalarni Boshqarish va Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminOrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Barcha mijozlar buyurtmalarini olish (Faqat Admin)' })
  @Get('orders')
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Buyurtma statusini yangilash (PENDING, PREPARING, READY, DELIVERED, CANCELLED)' })
  @ApiParam({ name: 'id', example: 1, description: 'Buyurtma ID si' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', example: 'PREPARING', enum: ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'] } } } })
  @Patch('orders/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED',
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  @ApiOperation({ summary: 'Admin dashboard daromad va statistikalarini olish (Faqat Admin)' })
  @Get('dashboard/stats')
  getStats() {
    return this.ordersService.getStats();
  }
}

