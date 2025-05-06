-- AlterTable
ALTER TABLE "SubscriptionPlan" ADD COLUMN     "isTrial" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "SubscriptionPlan_isTrial_idx" ON "SubscriptionPlan"("isTrial");
