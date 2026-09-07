import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { AdminReservationsController } from './admin-reservations.controller';

@Module({
  controllers: [ReservationsController, AdminReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
