import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const subscriptionSchema = z.object({
  plan: z.enum(['FREE', 'BASIC', 'PRO', 'ENTERPRISE']),
  paymentMethod: z.string(),
  isAutoRenew: z.boolean(),
  duration: z.enum(['monthly', 'quarterly', 'half-yearly', 'annual']),
});

export async function GET(request: NextRequest) {
  try {
    getAuthUser(request); // Verify authentication
    const requestedCompanyId = getAuthUser(request)?.companyId;

    if (!requestedCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.companyId, requestedCompanyId))
      .limit(1);

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription);
  } catch (err) {
    console.error('Error in GET subscription:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    getAuthUser(request); // Verify authentication
    const requestedCompanyId = getAuthUser(request)?.companyId;

    if (!requestedCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Check if a subscription already exists for the company
    const existingSubscription = await db
      .select({ id: subscriptions.id })
      .from(subscriptions)
      .where(eq(subscriptions.companyId, requestedCompanyId))
      .limit(1);

    if (existingSubscription.length > 0) {
      return NextResponse.json(
        {
          error: 'A subscription already exists for this company',
        },
        { status: 409 }
      );
    }

    const body = await request.json();
    const subscriptionData = subscriptionSchema.parse(body);

    const [subscription] = await db
      .insert(subscriptions)
      .values({
        companyId: requestedCompanyId,
        ...subscriptionData,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        maxUsers: 5, // Default value
        maxStorage: 1024, // Default value in MB
        features: ['basic'], // Default features
        isActive: true,
      })
      .returning();

    return NextResponse.json(subscription);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST subscription:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    getAuthUser(request); // Verify authentication
    const requestedCompanyId = getAuthUser(request)?.companyId;

    if (!requestedCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const subscriptionData = subscriptionSchema.parse(body);

    const [subscription] = await db
      .update(subscriptions)
      .set(subscriptionData)
      .where(eq(subscriptions.companyId, requestedCompanyId))
      .returning();

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT subscription:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    getAuthUser(request); // Verify authentication
    const requestedCompanyId = getAuthUser(request)?.companyId;

    if (!requestedCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    await db
      .update(subscriptions)
      .set({ isActive: false })
      .where(eq(subscriptions.companyId, requestedCompanyId));

    return NextResponse.json({ message: 'Subscription deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE subscription:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}