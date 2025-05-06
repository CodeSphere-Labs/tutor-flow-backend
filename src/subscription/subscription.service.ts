import { Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';

import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async checkTrialStatus(tutorId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        plan: {
          isTrial: true,
        },
        tutorId,
      },
    });

    if (!subscription) {
      return {
        daysLeft: 0,
        hasTrial: false,
        status: null,
      };
    }

    const today = new Date();
    const endDate = new Date(subscription.endDate);
    const daysLeft = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
    );

    return {
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      hasTrial: true,
      isExpired: today > endDate,
      status: subscription.status,
      subscription,
    };
  }

  async createSubscriptionWithPlan(tutorId: string, planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new Error('План подписки не найден');
    }

    const startDate = new Date();
    const endDate = addDays(startDate, plan.duration);

    return this.prisma.subscription.create({
      data: {
        autoRenew: !plan.isTrial,
        endDate,
        planId,
        startDate,
        status: 'ACTIVE',
        tutorId,
      },
      include: {
        plan: true,
      },
    });
  }

  async createTrialSubscription(tutorId: string) {
    const trialPlan = await this.prisma.subscriptionPlan.findFirst({
      where: { isActive: true, isTrial: true },
    });

    if (!trialPlan) {
      const newTrialPlan = await this.prisma.subscriptionPlan.create({
        data: {
          description: 'Бесплатный доступ ко всем функциям на 14 дней',
          duration: 14,
          features: [
            'Все функции платформы',
            'Неограниченное количество уроков',
          ],
          isActive: true,
          isTrial: true,
          name: 'Пробный период',
          price: 0,
        },
      });

      return this.createSubscriptionWithPlan(tutorId, newTrialPlan.id);
    }

    return this.createSubscriptionWithPlan(tutorId, trialPlan.id);
  }

  async getActiveSubscription(tutorId: string) {
    return this.prisma.subscription.findFirst({
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        endDate: {
          gte: new Date(),
        },
        status: 'ACTIVE',
        tutorId,
      },
    });
  }

  async upgradeToPaidSubscription(subscriptionId: string, newPlanId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      include: { plan: true },
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error('Подписка не найдена');
    }

    const newPlan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: newPlanId },
    });

    if (!newPlan) {
      throw new Error('План подписки не найден');
    }

    const startDate = new Date();
    const endDate = addDays(startDate, newPlan.duration);

    return this.prisma.subscription.update({
      data: {
        autoRenew: true,
        endDate,
        planId: newPlanId,
        startDate,
        status: 'ACTIVE',
      },
      include: {
        plan: true,
      },
      where: { id: subscriptionId },
    });
  }
}
