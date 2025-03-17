import { prisma } from "@/lib/prisma";
import { addDays } from "@/lib/utils";

export enum Plan {
  TRIAL = "TRIAL",
  FREE = "FREE",
  BASIC = "BASIC",
  PROFESSIONAL = "PROFESSIONAL",
  ENTERPRISE = "ENTERPRISE",
}

export enum Feature {
  ORDER_MATRIX = "ORDER_MATRIX",
  INVENTORY_AXIS = "INVENTORY_AXIS",
  ADVANCED_REPORTING = "ADVANCED_REPORTING",
  API_ACCESS = "API_ACCESS",
  MULTI_LOCATION = "MULTI_LOCATION",
  BATCH_TRACKING = "BATCH_TRACKING",
  SERIAL_TRACKING = "SERIAL_TRACKING",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  PAST_DUE = "PAST_DUE",
  CANCELED = "CANCELED",
  UNPAID = "UNPAID",
  TRIAL = "TRIAL",
}

const TRIAL_PERIOD_DAYS = 30;

export const subscriptionFeatures: Record<Plan, Feature[]> = {
  [Plan.TRIAL]: [
    Feature.ORDER_MATRIX,
    Feature.INVENTORY_AXIS,
    Feature.ADVANCED_REPORTING,
    Feature.MULTI_LOCATION,
  ],
  [Plan.FREE]: [
    Feature.ORDER_MATRIX,
    Feature.INVENTORY_AXIS,
  ],
  [Plan.BASIC]: [
    Feature.ORDER_MATRIX,
    Feature.INVENTORY_AXIS,
    Feature.MULTI_LOCATION,
  ],
  [Plan.PROFESSIONAL]: [
    Feature.ORDER_MATRIX,
    Feature.INVENTORY_AXIS,
    Feature.ADVANCED_REPORTING,
    Feature.MULTI_LOCATION,
    Feature.BATCH_TRACKING,
  ],
  [Plan.ENTERPRISE]: [
    Feature.ORDER_MATRIX,
    Feature.INVENTORY_AXIS,
    Feature.ADVANCED_REPORTING,
    Feature.MULTI_LOCATION,
    Feature.BATCH_TRACKING,
    Feature.SERIAL_TRACKING,
    Feature.API_ACCESS,
  ],
};

export async function createTrialSubscription(companyId: string) {
  const trialStartDate = new Date();
  const trialEndDate = addDays(trialStartDate, TRIAL_PERIOD_DAYS);

  const subscription = await prisma.$transaction(async (tx) => {
    return tx.subscription.create({
      data: {
        companyId,
        plan: Plan.TRIAL,
        status: SubscriptionStatus.TRIAL,
        trialStartDate,
        trialEndDate,
        currentPeriodStart: trialStartDate,
        currentPeriodEnd: trialEndDate,
        features: {
          create: subscriptionFeatures[Plan.TRIAL].map((feature) => ({
            feature,
            enabled: true,
          })),
        },
      },
    });
  });

  return subscription;
}

export async function hasFeatureAccess(companyId: string, feature: Feature) {
  const subscription = await prisma.$transaction(async (tx) => {
    return tx.subscription.findUnique({
      where: { companyId },
      include: { features: true },
    });
  });

  if (!subscription) {
    return false;
  }

  // Check if subscription is active or in trial
  if (
    subscription.status !== SubscriptionStatus.ACTIVE &&
    subscription.status !== SubscriptionStatus.TRIAL
  ) {
    return false;
  }

  // Check if trial has expired
  if (
    subscription.status === SubscriptionStatus.TRIAL &&
    subscription.trialEndDate < new Date()
  ) {
    // Update subscription status to UNPAID
    await prisma.$transaction(async (tx) => {
      await tx.subscription.update({
        where: { id: subscription.id },
        data: { status: SubscriptionStatus.UNPAID },
      });
    });
    return false;
  }

  // Check if subscription period has expired
  if (subscription.currentPeriodEnd < new Date()) {
    return false;
  }

  // Check if feature is enabled for this subscription
  const subscriptionFeature = subscription.features.find(
    (f: { feature: Feature }) => f.feature === feature
  );

  return subscriptionFeature?.enabled ?? false;
}

export async function updateSubscriptionPlan(
  companyId: string,
  plan: Plan,
  periodInDays: number = 30
) {
  const currentDate = new Date();
  const periodEndDate = addDays(currentDate, periodInDays);

  const subscription = await prisma.$transaction(async (tx) => {
    return tx.subscription.update({
      where: { companyId },
      data: {
        plan,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: currentDate,
        currentPeriodEnd: periodEndDate,
        features: {
          deleteMany: {},
          create: subscriptionFeatures[plan].map((feature) => ({
            feature,
            enabled: true,
          })),
        },
      },
    });
  });

  return subscription;
}

export async function cancelSubscription(companyId: string) {
  const subscription = await prisma.$transaction(async (tx) => {
    return tx.subscription.update({
      where: { companyId },
      data: {
        status: SubscriptionStatus.CANCELED,
        cancelAtPeriodEnd: true,
      },
    });
  });

  return subscription;
} 