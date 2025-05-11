import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { signJwt, verifyJwt } from '@/lib/jwt';
import { getToken, setToken } from '@/lib/server-cookies';

export async function POST() {
  try {
    const token = await getToken();;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      const payload = await verifyJwt(token);
      const userId = payload.userId;

      const [user] = await db
        .select({
          id: users.id,
          companyId: users.companyId,
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

      const newToken = await signJwt({ userId: user.id, companyId: user.companyId ?? "" });
      await setToken(newToken);

      return NextResponse.json({ token: newToken });
    } catch  {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  } catch (err) {
    console.error('Error in POST refresh-token:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
