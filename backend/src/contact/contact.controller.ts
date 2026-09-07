import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Contact - Aloqa va Xabarlar')
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @ApiOperation({ summary: 'Foydalanuvchilar tomonidan murojaat xabarini yuborish' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Jasur' },
        email: { type: 'string', example: 'jasur@gmail.com' },
        phone: { type: 'string', example: '+998901234567' },
        message: { type: 'string', example: 'Restoranda VIP stol bor-yo\'qligini bilmoqchi edim.' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Xabar muvaffaqiyatli saqlandi' })
  @Post()
  create(@Body() dto: { name: string; email: string; phone: string; message: string }) {
    return this.contactService.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kelib tushgan barcha murojaat xabarlarini ko\'rish (Faqat Admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/messages')
  findAll() {
    return this.contactService.findAll();
  }
}

