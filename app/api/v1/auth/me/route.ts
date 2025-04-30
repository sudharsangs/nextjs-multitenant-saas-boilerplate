import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getToken } from '@/lib/cookies';
import { verifyJwt } from '@/lib/jwt';

export async function GET() {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyJwt(token);
    const userId = payload.userId;

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        department: users.department,
        companyId: users.companyId,
        lastLoginAt: users.lastLoginAt,
        emailVerified: users.emailVerified,
        twoFactorEnabled: users.twoFactorEnabled,
        permissions: users.permissions,
        preferences: users.preferences,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Error in GET auth/me:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
