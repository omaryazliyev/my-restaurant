import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; email: string; phone: string; message: string }) {
    return this.prisma.contactMessage.create({ data });
  }

  // Admin uchun
  findAll() {
    return this.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
