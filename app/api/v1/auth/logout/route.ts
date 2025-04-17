import { NextResponse } from 'next/server';
import { deleteToken } from '@/lib/cookies';


export async function DELETE() {
    try {
        await deleteToken();
        return NextResponse.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Error in DELETE auth:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}