import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus } from '@prisma/client';

import { SubscriptionPlanDto } from './subscription-plan-dto';

export class SubscriptionDto {
  @ApiProperty({ description: 'Флаг автопродления подписки' })
  autoRenew: boolean;

  @ApiProperty({ description: 'Дата окончания подписки' })
  endDate: Date;

  @ApiProperty({ description: 'ID подписки' })
  id: string;

  @ApiProperty({ description: 'План подписки', type: SubscriptionPlanDto })
  plan: SubscriptionPlanDto;

  @ApiProperty({ description: 'Дата начала подписки' })
  startDate: Date;

  @ApiProperty({ description: 'Статус подписки', enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @ApiProperty({ description: 'ID преподавателя' })
  tutorId: string;
}

export class TrialStatusResponseDto {
  @ApiProperty({ description: 'Количество оставшихся дней пробной подписки' })
  daysLeft: number;

  @ApiProperty({ description: 'Флаг наличия пробной подписки' })
  hasTrial: boolean;

  @ApiProperty({
    description: 'Флаг истечения пробной подписки',
    required: false,
  })
  isExpired?: boolean;

  @ApiProperty({
    description: 'Статус пробной подписки',
    enum: SubscriptionStatus,
    required: false,
  })
  status?: SubscriptionStatus;

  @ApiProperty({
    description: 'Информация о подписке',
    required: false,
    type: SubscriptionDto,
  })
  subscription?: SubscriptionDto;
}
