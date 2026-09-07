import { IsEnum, IsInt, IsOptional, IsString, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DeliveryMethod {
  PICKUP = 'PICKUP',
  DOOR_DELIVERY = 'DOOR_DELIVERY',
  ADDRESS = 'ADDRESS',
}

export enum PaymentMethod {
  ONLINE_CARD = 'ONLINE_CARD',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

class OrderItemDto {
  @ApiProperty({ example: 1, description: 'Taom ID si' })
  @IsInt()
  menuItemId: number;

  @ApiProperty({ example: 2, description: 'Taom miqdori (soni)' })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ enum: DeliveryMethod, example: DeliveryMethod.DOOR_DELIVERY, description: 'Yetkazib berish turi' })
  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @ApiPropertyOptional({ example: 'Toshkent sh., Chilonzor 9-mavze, 12-uy', description: 'Yetkazib berish manzili' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.ONLINE_CARD, description: 'To\'lov turi' })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ type: [OrderItemDto], description: 'Savatdagi taomlar ro\'yxati' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

