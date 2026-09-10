import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  findAll(categoryName?: string) {
    return this.prisma.menuItem.findMany({
      where: categoryName ? { category: { name: { contains: categoryName, mode: 'insensitive' } } } : undefined,
      include: { category: true },
      orderBy: { id: 'desc' },
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

  async create(dto: CreateMenuItemDto) {
    let catId = dto.categoryId;

    // Resolve Category ID if categoryName provided or if catId is missing/invalid
    const categoryName = dto.categoryName || 'Birinchi taomlar';

    if (!catId) {
      let existingCategory = await this.prisma.category.findUnique({
        where: { name: categoryName },
      });

      if (!existingCategory) {
        existingCategory = await this.prisma.category.create({
          data: { name: categoryName },
        });
      }
      catId = existingCategory.id;
    }

    return this.prisma.menuItem.create({
      data: {
        name: dto.name,
        description: dto.description || '',
        price: dto.price,
        image: dto.image || '',
        categoryId: catId,
      },
      include: { category: true },
    });
  }

  async update(id: number, dto: Partial<CreateMenuItemDto>) {
    let catId = dto.categoryId;

    if (dto.categoryName) {
      let existingCategory = await this.prisma.category.findUnique({
        where: { name: dto.categoryName },
      });
      if (!existingCategory) {
        existingCategory = await this.prisma.category.create({
          data: { name: dto.categoryName },
        });
      }
      catId = existingCategory.id;
    }

    const updateData: any = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.price !== undefined) updateData.price = dto.price;
    if (dto.image !== undefined) updateData.image = dto.image;
    if (catId !== undefined) updateData.categoryId = catId;

    return this.prisma.menuItem.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });
  }

  remove(id: number) {
    return this.prisma.menuItem.delete({
      where: { id },
    });
  }
}
