import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) { }

  findAll(categoryName?: string) {
    return this.prisma.menuItem.findMany({
      where: categoryName ? { category: { name: categoryName } } : undefined,
      include: { category: true },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: { category: true, reviews: true },
    });
    if (!item) throw new NotFoundException('Taom topilmadi');
    return item;
  }

  findSimilar(categoryId: number, excludeId: number) {
    return this.prisma.menuItem.findMany({
      where: { categoryId, NOT: { id: excludeId } },
      take: 4,
    });
  }

  create(dto: CreateMenuItemDto) {
    return this.prisma.menuItem.create({ data: dto });
  }

  
  update(id: number, dto: Partial<CreateMenuItemDto> ) {
    return this.prisma.menuItem.update({
      where: { id },
      data: dto ,
    });
  }


  remove(id: number) {
    return this.prisma.menuItem.delete({
      where: { id },
    });
  }

  
}
