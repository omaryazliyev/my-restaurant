import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) { }

  async create(userId: number, dto: CreateReservationDto) {
    const existing = await this.prisma.reservation.findFirst({
      where: {
        tableId: dto.tableId,
        date: new Date(dto.date),
        startTime: new Date(dto.startTime),
        status: { not: 'CANCELLED' },
      },
    });

    if (existing) {
      throw new ConflictException('Ushbu stol kiritilgan vaqtda allaqachon bron qilingan');
    }

    return this.prisma.reservation.create({
      data: {
        userId,
        tableId: dto.tableId,
        phone: dto.phone,
        guests: dto.guests,
        date: new Date(dto.date),
        startTime: new Date(dto.startTime),
      },
    });
  }

  findMyReservations(userId: number) {
    return this.prisma.reservation.findMany({
      where: { userId },
      include: { table: true },
    });
  }

  findAll() {
    return this.prisma.reservation.findMany({
      include: { user: true, table: true },
    });
  }

  updateStatus(id: number, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') {
    return this.prisma.reservation.update({
      where: { id },
      data: { status },
    });
  }
}
