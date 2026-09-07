import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth - Autentifikatsiya')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Yangi foydalanuvchini ro\'yxatdan o\'tkazish' })
  @ApiResponse({ status: 201, description: 'Foydalanuvchi muvaffaqiyatli yaratildi va token berildi' })
  @ApiResponse({ status: 409, description: 'Username yoki telefon raqami allaqachon mavjud' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Tizimga kirish (Login)' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli kirildi va JWT token berildi' })
  @ApiResponse({ status: 401, description: 'Username yoki parol noto\'g\'ri' })
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}

