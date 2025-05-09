import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function POST() {
  try {
    // Clear the auth token
    cookies().delete('token');

    return NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}