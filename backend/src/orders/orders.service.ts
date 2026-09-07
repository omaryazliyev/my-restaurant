import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  async create(userId: number, dto: CreateOrderDto) {
    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of dto.items) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem) {
        throw new NotFoundException(`Taom (ID: ${item.menuItemId}) topilmadi`);
      }

      const itemTotal = Number(menuItem.price) * item.quantity;
      totalPrice += itemTotal;


      orderItemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        priceAtOrder: menuItem.price, 
      });
    }

    return this.prisma.order.create({
      data: {
        userId,
        deliveryMethod: dto.deliveryMethod,
        address: dto.address,
        paymentMethod: dto.paymentMethod,
        totalPrice,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: { menuItem: true },
        },
      },
    });
  }

  findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { menuItem: true } }, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateStatus(id: number, status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED') {
    return this.prisma.order.update({ where: { id }, data: { status } });
  }

  // Admin dashboard statistikasi uchun
  async getStats() {
    // TODO: bugungi buyurtmalar soni, jami daromad, top taomlar
  }
}
