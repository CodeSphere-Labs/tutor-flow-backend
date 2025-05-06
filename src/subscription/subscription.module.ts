import { Module } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
  providers: [SubscriptionService, PrismaService],
})
export class SubscriptionModule {}
