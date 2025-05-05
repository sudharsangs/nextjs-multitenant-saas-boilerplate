import { NextResponse } from 'next/server';
import { db } from '@/db';
import { companies, subscriptions, users } from '@/db/schema';
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

    // Fetch company and subscription details
    let companyDetails = null;
    let subscriptionDetails = null;
    
    if (user.companyId) {
      const [company] = await db
        .select()
        .from(companies) 
        .where(eq(companies.id, user.companyId))
        .limit(1);
      
      companyDetails = company;
      
      if (company) {
        // Get the latest active subscription for the company
        const [subscription] = await db
          .select()
          .from(subscriptions) // Assuming there's a subscriptions table
          .where(eq(subscriptions.companyId, company.id))
          
        subscriptionDetails = subscription;
      }
    }

    return NextResponse.json({ 
      user,
      company: companyDetails,
      subscription: subscriptionDetails
    });
  } catch (err) {
    console.error('Error in GET auth/me:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
