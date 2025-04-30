import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { companies, subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

const companySchema = z.object({
  name: z.string().min(2),
  gstin: z.string().optional(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  pincode: z.string(),
  phone: z.string(),
  email: z.string().email(),
  website: z.string().url().optional(),
  billingAddress: z.string().optional(),
  logo: z.string().optional(),
  theme: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

const subscriptionSchema = z.object({
  plan: z.enum(['FREE', 'BASIC', 'PRO', 'ENTERPRISE']),
  paymentMethod: z.string(),
  isAutoRenew: z.boolean(),
});

export async function GET(request: NextRequest) {
  try {
    getAuthUser(request); // Just verify authentication
    const { searchParams } = new URL(request.url);
    const requestedCompanyId = searchParams.get('companyId');

    if (requestedCompanyId) {
      const [company] = await db
        .select()
        .from(companies)
        .where(eq(companies.id, requestedCompanyId))
        .limit(1);

      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(company);
    }

    const companiesList = await db
      .select()
      .from(companies)
      .where(eq(companies.isActive, true));

    return NextResponse.json(companiesList);
  } catch (err) {
    console.error('Error in GET companies:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    getAuthUser(request); // Just verify authentication
    const body = await request.json();
    const companyData = companySchema.parse(body);

    const [company] = await db
      .insert(companies)
      .values({
        ...companyData,
        isActive: true,
      })
      .returning();

    return NextResponse.json(company);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST companies:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    getAuthUser(request); // Just verify authentication
    const { searchParams } = new URL(request.url);
    const requestedCompanyId = searchParams.get('companyId');

    if (!requestedCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const companyData = companySchema.parse(body);

    const [company] = await db
      .update(companies)
      .set(companyData)
      .where(eq(companies.id, requestedCompanyId))
      .returning();

    return NextResponse.json(company);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT companies:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    getAuthUser(request); // Just verify authentication
    const { searchParams } = new URL(request.url);
    const requestedCompanyId = searchParams.get('companyId');

    if (!requestedCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    await db
      .update(companies)
      .set({ isActive: false })
      .where(eq(companies.id, requestedCompanyId));

    return NextResponse.json({ message: 'Company deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE companies:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Subscription Management
export async function GET_SUBSCRIPTION(request: NextRequest) {
  try {
    getAuthUser(request); // Just verify authentication
    const { searchParams } = new URL(request.url);
    const requestedCompanyId = searchParams.get('companyId');

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

    return NextResponse.json(subscription);
  } catch (err) {
    console.error('Error in GET subscription:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST_SUBSCRIPTION(request: NextRequest) {
  try {
    getAuthUser(request); // Just verify authentication
    const { searchParams } = new URL(request.url);
    const requestedCompanyId = searchParams.get('companyId');

    if (!requestedCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
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

export async function PUT_SUBSCRIPTION(request: NextRequest) {
  try {
    getAuthUser(request); // Just verify authentication
    const { searchParams } = new URL(request.url);
    const requestedCompanyId = searchParams.get('companyId');

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

export async function DELETE_SUBSCRIPTION(request: NextRequest) {
  try {
    getAuthUser(request); // Just verify authentication
    const { searchParams } = new URL(request.url);
    const requestedCompanyId = searchParams.get('companyId');

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