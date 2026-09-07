import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // TODO: admin uchun - findAll(), qidiruv/filter bilan
}
