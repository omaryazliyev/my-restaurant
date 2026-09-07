import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { AdminMenuController } from './admin-menu.controller';

@Module({
  controllers: [MenuController, AdminMenuController],
  providers: [MenuService],
})
export class MenuModule {}
