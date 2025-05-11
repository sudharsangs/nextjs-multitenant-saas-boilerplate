import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

const userSchema = z.object({
  companyId: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.string(),
  department: z.string().optional(),
  password: z.string().min(6),
});

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const requestedCompanyId = getAuthUser(request)?.companyId;

    if (!requestedCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Verify that the user has access to the requested company
    if (requestedCompanyId !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized access to company data' },
        { status: 403 }
      );
    }

    const usersList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        department: users.department,
        lastLoginAt: users.lastLoginAt,
        emailVerified: users.emailVerified,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(and(
        eq(users.companyId, companyId),
        eq(users.isActive, true)
      ));

    return NextResponse.json(usersList);
  } catch (err) {
    console.error('Error in GET users:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const body = await request.json();
    const userData = userSchema.parse(body);

    // Verify that the user is creating a user for their own company
    if (userData.companyId !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized to create users for other companies' },
        { status: 403 }
      );
    }

    // Check if user with email already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Ensure role is one of the allowed values
    const allowedRoles = ["ADMIN", "MANAGER", "STAFF", "VIEWER"] as const;
    if (!allowedRoles.includes(userData.role as typeof allowedRoles[number])) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const [createdUser] = await db
      .insert(users)
      .values({
        ...userData,
        role: userData.role as typeof allowedRoles[number],
        password: hashedPassword,
        isActive: true,
        emailVerified: false,
        twoFactorEnabled: false,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        department: users.department,
        companyId: users.companyId,
        createdAt: users.createdAt,
      });

    return NextResponse.json(createdUser);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST users:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
