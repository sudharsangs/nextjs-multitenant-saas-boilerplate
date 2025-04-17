import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { signJwt } from '@/lib/jwt';
import bcrypt from 'bcryptjs';
import { setToken } from '@/lib/cookies';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});


export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = loginSchema.parse(body);

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = await signJwt({ userId: user.id });
        await setToken(token);

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                companyId: user.companyId,
            },
        });
    } catch (err) {
        console.error('Error in POST auth:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}