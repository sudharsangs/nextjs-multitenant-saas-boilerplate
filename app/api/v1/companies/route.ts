import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { companies, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';
import { signJwt } from '@/lib/jwt';
import { cookies } from 'next/headers';

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
  website: z.string().url().optional().nullable(),
  billingAddress: z.string().optional(),
  logo: z.string().optional(),
  theme: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    getAuthUser(request); // Just verify authentication
    const requestedCompanyId = getAuthUser(request)?.companyId;

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
    const { userId } = getAuthUser(request);
    const body = await request.json();
    const companyData = companySchema.parse(body);

    // Check if a company with the same identifiers already exists
    const existingCompany = await db
      .select({ id: companies.id })
      .from(companies)
      .where(
        eq(companies.phone, companyData.phone) ||
        eq(companies.email, companyData.email) ||
        (companyData.gstin ? eq(companies.gstin, companyData.gstin) : undefined)
      )
      .limit(1);

    if (existingCompany.length > 0) {
      return NextResponse.json(
        {
          error: 'Company with the same phone, email, or GST number already exists',
        },
        { status: 409 }
      );
    }

    const [company] = await db
      .insert(companies)
      .values({
        ...companyData,
        isActive: true,
      })
      .returning();

    // Update the user's companyId
    await db
      .update(users)
      .set({ companyId: company.id })
      .where(eq(users.id, userId));

    // Generate a new token with updated company ID
    const token = await signJwt({
      userId,
      companyId: company.id,
    });

    // Set the new token in cookies
    cookies().set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

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
    const requestedCompanyId = getAuthUser(request)?.companyId;

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
    const requestedCompanyId = getAuthUser(request)?.companyId;
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