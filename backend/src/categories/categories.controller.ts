import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Categories - Menyu Kategoriyalari')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) { }

  @ApiOperation({ summary: 'Barcha kategoriyalarni olish (Ochiq)' })
  @ApiResponse({ status: 200, description: 'Kategoriyalar ro\'yxati' })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi kategoriya yaratish (Faqat Admin)' })
  @ApiBody({ schema: { type: 'object', properties: { name: { type: 'string', example: 'Первые' } } } })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body('name') name: string) {
    return this.categoriesService.create(name);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kategoriyani tahrirlash (Faqat Admin)' })
  @ApiParam({ name: 'id', example: 1, description: 'Kategoriya ID si' })
  @ApiBody({ schema: { type: 'object', properties: { name: { type: 'string', example: 'Вторые' } } } })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body('name') name: string) {
    return this.categoriesService.update(id, name);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kategoriyani o\'chirish (Faqat Admin)' })
  @ApiParam({ name: 'id', example: 1, description: 'Kategoriya ID si' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}

