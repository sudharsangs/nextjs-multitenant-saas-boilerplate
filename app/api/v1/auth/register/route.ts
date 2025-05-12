import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { signJwt } from '@/lib/jwt';
import bcrypt from 'bcryptjs';
import { setToken } from '@/lib/cookies';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    companyId: z.string().optional().nullable(),
    role: z.string().optional().nullable(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, companyId, role } = registerSchema.parse(body);

        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json(
                { error: 'Email already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [user] = await db
            .insert(users)
            .values({
                name,
                email,
                password: hashedPassword,
                companyId: companyId || null,
                isActive: true,
                role: (role as "ADMIN" | "MANAGER" | "STAFF" | "VIEWER") ?? "ADMIN"
            })
            .returning();

        const token = await signJwt({ userId: user.id, companyId: user.companyId ?? "" });
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
