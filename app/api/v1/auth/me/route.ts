import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    return NextResponse.json({
      success: true,
      user: {
        userId: user.userId,
        companyId: user.companyId,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication required'
      },
      { status: 401 }
    );
  }
}
