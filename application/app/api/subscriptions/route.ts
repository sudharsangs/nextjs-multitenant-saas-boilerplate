import { NextRequest } from "next/server";
import { withAuth } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const createSubscriptionSchema = z.object({
  plan: z.enum(['TRIAL', 'FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE']),
  features: z.array(z.enum(['ORDER_MATRIX', 'INVENTORY_AXIS', 'ADVANCED_REPORTING', 'API_ACCESS', 'MULTI_LOCATION', 'BATCH_TRACKING', 'SERIAL_TRACKING'])),
  trialEndDate: z.string().datetime(),
  currentPeriodStart: z.string().datetime(),
  currentPeriodEnd: z.string().datetime(),
  cancelAtPeriodEnd: z.boolean().optional(),
});

const updateSubscriptionSchema = z.object({
  plan: z.enum(['TRIAL', 'FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE']).optional(),
  features: z.array(z.enum(['ORDER_MATRIX', 'INVENTORY_AXIS', 'ADVANCED_REPORTING', 'API_ACCESS', 'MULTI_LOCATION', 'BATCH_TRACKING', 'SERIAL_TRACKING'])).optional(),
  status: z.enum(['ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID', 'TRIAL']).optional(),
  trialEndDate: z.string().datetime().optional(),
  currentPeriodStart: z.string().datetime().optional(),
  currentPeriodEnd: z.string().datetime().optional(),
  cancelAtPeriodEnd: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  return withAuth(req, async (_, companyId) => {
    try {
      const data = createSubscriptionSchema.parse(await req.json());

      // Check if subscription already exists
      const existingSubscription = await prisma.subscription.findUnique({
        where: { companyId },
      });

      if (existingSubscription) {
        return errorResponse('Subscription already exists', 400);
      }

      // Create subscription and features
      const subscription = await prisma.subscription.create({
        data: {
          companyId,
          plan: data.plan,
          trialEndDate: new Date(data.trialEndDate),
          currentPeriodStart: new Date(data.currentPeriodStart),
          currentPeriodEnd: new Date(data.currentPeriodEnd),
          cancelAtPeriodEnd: data.cancelAtPeriodEnd,
          features: {
            createMany: {
              data: data.features.map((feature) => ({
                feature,
                enabled: true,
              })),
            },
          },
        },
        include: {
          features: true,
        },
      });

      return successResponse(subscription);
    } catch (error) {
      console.error('Error creating subscription:', error);
      if (error instanceof z.ZodError) {
        return errorResponse(error.errors[0].message, 400);
      }
      return errorResponse('Failed to create subscription', 500);
    }
  });
}

export async function GET(req: NextRequest) {
  return withAuth(req, async (_, companyId) => {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { companyId },
        include: {
          features: true,
        },
      });

      if (!subscription) {
        return errorResponse('Subscription not found', 404);
      }

      return successResponse(subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return errorResponse('Failed to fetch subscription', 500);
    }
  });
}

export async function PATCH(req: NextRequest) {
  return withAuth(req, async (_, companyId) => {
    try {
      const data = updateSubscriptionSchema.parse(await req.json());

      // Check if subscription exists
      const existingSubscription = await prisma.subscription.findUnique({
        where: { companyId },
      });

      if (!existingSubscription) {
        return errorResponse('Subscription not found', 404);
      }

      // Update subscription
      const subscription = await prisma.subscription.update({
        where: { companyId },
        data: {
          plan: data.plan,
          status: data.status,
          trialEndDate: data.trialEndDate ? new Date(data.trialEndDate) : undefined,
          currentPeriodStart: data.currentPeriodStart ? new Date(data.currentPeriodStart) : undefined,
          currentPeriodEnd: data.currentPeriodEnd ? new Date(data.currentPeriodEnd) : undefined,
          cancelAtPeriodEnd: data.cancelAtPeriodEnd,
          ...(data.features && {
            features: {
              deleteMany: {},
              createMany: {
                data: data.features.map((feature) => ({
                  feature,
                  enabled: true,
                })),
              },
            },
          }),
        },
        include: {
          features: true,
        },
      });

      return successResponse(subscription);
    } catch (error) {
      console.error('Error updating subscription:', error);
      if (error instanceof z.ZodError) {
        return errorResponse(error.errors[0].message, 400);
      }
      return errorResponse('Failed to update subscription', 500);
    }
  });
} 