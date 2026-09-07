import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Orders - Buyurtmalar va Savat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Yangi buyurtma rasmiylashtirish (Checkout)' })
  @ApiResponse({ status: 201, description: 'Buyurtma muvaffaqiyatli saqlandi va yaratildi' })
  @Post()
  create(@CurrentUser() user, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.userId, dto);
  }

  @ApiOperation({ summary: 'Foydalanuvchining o\'z buyurtmalari tarixini olish' })
  @Get('me')
  findMine(@CurrentUser() user) {
    return this.ordersService.findMyOrders(user.userId);
  }
}

