import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Menu - Taomlar Menyusi')
@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) { }

  @ApiOperation({ summary: 'Barcha taomlarni olish (Kategoriya bo\'yicha filterlash bilan)' })
  @ApiQuery({ name: 'category', required: false, example: 'Первые', description: 'Kategoriya nomi' })
  @Get()
  findAll(@Query('category') category?: string) {
    return this.menuService.findAll(category);
  }

  @ApiOperation({ summary: 'Bitta taom ma\'lumotini ID bo\'yicha olish' })
  @ApiParam({ name: 'id', example: 1, description: 'Taom ID si' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @ApiOperation({ summary: 'Shu taomga o\'xshash boshqa 4 ta taomni olish (Figma "Похожие" bloki uchun)' })
  @ApiParam({ name: 'id', example: 1, description: 'Asosiy taom ID si' })
  @Get(':id/similar')
  async findSimilar(@Param('id', ParseIntPipe) id: number) {
    const item = await this.menuService.findOne(id);
    return this.menuService.findSimilar(item.categoryId, id);
  }

  @ApiOperation({ summary: 'Yangi taom qo\'shish' })
  @Post()
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuService.create(dto);
  }

  @ApiOperation({ summary: 'Taomni tahrirlash' })
  @ApiParam({ name: 'id', example: 1, description: 'Taom ID si' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateMenuItemDto>) {
    return this.menuService.update(id, dto);
  }

  @ApiOperation({ summary: 'Taomni o\'chirish' })
  @ApiParam({ name: 'id', example: 1, description: 'Taom ID si' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}
