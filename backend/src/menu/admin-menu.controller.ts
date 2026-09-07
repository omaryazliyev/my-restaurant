import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Admin Menu - Taomlarni Boshqarish')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/menu')
export class AdminMenuController {
  constructor(private menuService: MenuService) { }

  @ApiOperation({ summary: 'Yangi taom qo\'shish (Faqat Admin)' })
  @Post()
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuService.create(dto);
  }

  @ApiOperation({ summary: 'Taom ma\'lumotlarini o\'zgartirish (Faqat Admin)' })
  @ApiParam({ name: 'id', example: 1, description: 'Taom ID si' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateMenuItemDto>) {
    return this.menuService.update(id, dto);
  }

  @ApiOperation({ summary: 'Taomni menyudan o\'chirish (Faqat Admin)' })
  @ApiParam({ name: 'id', example: 1, description: 'Taom ID si' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}

