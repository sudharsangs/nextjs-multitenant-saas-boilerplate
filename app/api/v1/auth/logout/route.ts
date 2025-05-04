import { NextResponse } from 'next/server';
import { deleteToken } from '@/lib/cookies';


export async function POST() {
  try {
    // Delete the authentication token from cookies
    await deleteToken();
    
    return NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (err) {
    console.error('Error in logout:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}