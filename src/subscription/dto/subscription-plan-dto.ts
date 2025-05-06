import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionPlanDto {
  @ApiProperty({ description: 'Описание плана подписки', required: false })
  description?: string;

  @ApiProperty({ description: 'Продолжительность плана в днях' })
  duration: number;

  @ApiProperty({ description: 'Список функций плана подписки', type: [String] })
  features: string[];

  @ApiProperty({ description: 'ID плана подписки' })
  id: string;

  @ApiProperty({ description: 'Флаг активности плана подписки' })
  isActive: boolean;

  @ApiProperty({ description: 'Флаг пробного плана подписки' })
  isTrial: boolean;

  @ApiProperty({ description: 'Название плана подписки' })
  name: string;

  @ApiProperty({ description: 'Стоимость плана подписки' })
  price: number;
}
