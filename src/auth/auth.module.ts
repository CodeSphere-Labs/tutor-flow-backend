import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '../database/prisma.module';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SubscriptionModule } from '../subscription/subscription.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
    }),
    SubscriptionModule,
  ],
  providers: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
