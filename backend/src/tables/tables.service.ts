import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) { }

  findAll() {
    return this.prisma.table.findMany();
  }

  async findAvailability(date: string, time: string) {
    const tables = await this.prisma.table.findMany();

    const dayReservations = await this.prisma.reservation.findMany({
      where: {
        date: new Date(date),
        status: { not: 'CANCELLED' }
      },
    });

    return tables.map((table) => {
      const sameHour = dayReservations.find(
        (r) => r.tableId === table.id && new Date(r.startTime).getTime() === new Date(time).getTime(),
      );

      const sameDay = dayReservations.find((r) => r.tableId === table.id);

      let status: 'free' | 'busyThisHour' | 'busyThisDay' = 'free';
      if (sameHour) status = 'busyThisHour';
      else if (sameDay) status = 'busyThisDay';

      return { ...table, status };
    });
  }

  create(data: { number: string; capacity: number; location?: string }) {
    return this.prisma.table.create({ data });
  }

  update(id: number, data: { number?: string; capacity?: number; location?: string }) {
    return this.prisma.table.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.table.delete({ where: { id } });
  }
}

