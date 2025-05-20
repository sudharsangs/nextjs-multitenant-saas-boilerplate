import { NextRequest } from 'next/server';
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export interface AuthUser {
  userId: string;
  companyId: string;
  email?: string;
  name?: string;
  role?: string;
}

export function getAuthUser(request: NextRequest): AuthUser {
  const userId = request.headers.get('x-user-id');
  const companyId = request.headers.get('x-company-id') || '';
  const email = request.headers.get('x-user-email') || undefined;
  const name = request.headers.get('x-user-name') || undefined;
  const role = request.headers.get('x-user-role') || undefined;

  if (!userId) {
    throw new Error('User ID not found in request headers');
  }

  return {
    userId,
    companyId,
    email,
    name,
    role
  };
}

export async function validateCredentials(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    companyId: user.companyId,
    role: user.role,
  };
} 