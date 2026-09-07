import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  findAll() {
    return this.prisma.category.findMany();
  }

  create(name: string) {
    return this.prisma.category.create({ data: { name } });
  }

  update(id: number, name: string) {
    return this.prisma.category.update({
      where: { id },
      data: { name },
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
