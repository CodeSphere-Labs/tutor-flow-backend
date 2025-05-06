import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpgradeSubscriptionDto {
  @ApiProperty({
    description: 'ID плана подписки для обновления',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: 'ID плана подписки обязателен' })
  @IsUUID(4, { message: 'ID плана подписки должен быть в формате UUID' })
  planId: string;
}
