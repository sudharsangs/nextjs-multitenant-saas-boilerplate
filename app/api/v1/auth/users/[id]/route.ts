import { db } from '@/db';
import { users } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Schema for user updates
const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    isActive: z.boolean().optional(),
});

interface UserUpdateValues {
    name?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
    updatedAt: Date;
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;

        const [user] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                companyId: users.companyId,
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
        console.error('Error getting user:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;
        const body = await request.json();

        // Validate input data
        const { name, email, password, isActive } = updateUserSchema.parse(body);

        // Check if user exists
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const updateValues: UserUpdateValues = {
            updatedAt: new Date()
        };

        if (name !== undefined) updateValues.name = name;
        if (email !== undefined) updateValues.email = email;
        if (isActive !== undefined) updateValues.isActive = isActive;

        // Hash password if provided
        if (password !== undefined) {
            updateValues.password = await bcrypt.hash(password, 10);
        }

        // Update the user
        const [updatedUser] = await db
            .update(users)
            .set(updateValues)
            .where(eq(users.id, userId))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                companyId: users.companyId,
                isActive: users.isActive,
                updatedAt: users.updatedAt,
            });

        return NextResponse.json({ user: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id;

        // Check if user exists
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Soft delete by setting the deletedAt timestamp
        const [deletedUser] = await db
            .update(users)
            .set({
                deletedAt: new Date(),
                isActive: false, // Also deactivate the user
                updatedAt: new Date()
            })
            .where(eq(users.id, userId))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                deletedAt: users.deletedAt
            });

        return NextResponse.json({
            message: 'User successfully deleted',
            user: {
                id: deletedUser.id,
                deletedAt: deletedUser.deletedAt
            }
        });
    } catch (err) {
        console.error('Error deleting user:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}




