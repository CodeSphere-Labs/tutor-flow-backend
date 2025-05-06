import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SubscriptionApiDescriptions } from '../common/constants/messages';
import {
  SubscriptionDto,
  TrialStatusResponseDto,
} from './dto/subscription-response.dto';
import { UpgradeSubscriptionDto } from './dto/upgrade-subscription.dto';
import { SubscriptionService } from './subscription.service';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiOperation({
    description: SubscriptionApiDescriptions.CHECK_TRIAL_STATUS,
    summary: 'Проверка статуса пробной подписки',
  })
  @ApiResponse({
    description: 'Информация о пробной подписке успешно получена',
    status: 200,
    type: TrialStatusResponseDto,
  })
  @Get('/tutor/:tutorId/trial-status')
  async checkTrialStatus(@Param('tutorId') tutorId: string) {
    return this.subscriptionService.checkTrialStatus(tutorId);
  }

  @ApiOperation({
    description: SubscriptionApiDescriptions.GET_ACTIVE_SUBSCRIPTION,
    summary: 'Получение активной подписки',
  })
  @ApiResponse({
    description: 'Информация об активной подписке успешно получена',
    status: 200,
    type: SubscriptionDto,
  })
  @Get('/tutor/:tutorId/active')
  async getActiveSubscription(@Param('tutorId') tutorId: string) {
    return this.subscriptionService.getActiveSubscription(tutorId);
  }

  @ApiOperation({
    description: SubscriptionApiDescriptions.UPGRADE_SUBSCRIPTION,
    summary: 'Обновление до платной подписки',
  })
  @ApiResponse({
    description: 'Подписка успешно обновлена',
    status: 200,
    type: SubscriptionDto,
  })
  @ApiResponse({
    description: 'Подписка или план не найдены',
    status: 400,
  })
  @Post('/upgrade/:subscriptionId')
  async upgradeToPaidSubscription(
    @Param('subscriptionId') subscriptionId: string,
    @Body() upgradeDto: UpgradeSubscriptionDto,
  ) {
    return this.subscriptionService.upgradeToPaidSubscription(
      subscriptionId,
      upgradeDto.planId,
    );
  }
}
