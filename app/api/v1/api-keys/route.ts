import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/db';
import { apiKeys, auditLogs } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import { generateApiKeyId, generateApiSecret, composeToken, hashSecret } from '@/lib/api-keys';

// GET /api/v1/api-keys - List API keys for the company (without secrets)
export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    if (!companyId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await db
      .select({
        id: apiKeys.id,
        companyId: apiKeys.companyId,
        name: apiKeys.name,
        key: apiKeys.key,
        permissions: apiKeys.permissions,
        expiresAt: apiKeys.expiresAt,
        lastUsedAt: apiKeys.lastUsedAt,
        isActive: apiKeys.isActive,
        createdAt: apiKeys.createdAt,
        updatedAt: apiKeys.updatedAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.companyId, companyId))
      .orderBy(desc(apiKeys.createdAt));

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('API Keys list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST /api/v1/api-keys - Create a new API key; returns the token once
export async function POST(request: NextRequest) {
  try {
    const { companyId, userId } = getAuthUser(request);
    if (!companyId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const name: string | undefined = body?.name;
    const permissions = body?.permissions ?? null;
    const expiresAtRaw: string | null = body?.expiresAt ?? null;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const keyId = generateApiKeyId();
    const secretPlain = generateApiSecret();
    const secretHash = hashSecret(secretPlain);

    const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

    const [created] = await db
      .insert(apiKeys)
      .values({
        companyId,
        name,
        key: keyId,
        secret: secretHash,
        permissions,
        expiresAt: expiresAt ?? undefined,
        isActive: true,
      })
      .returning();

    // Optional: write audit log
    try {
      await db.insert(auditLogs).values({
        companyId,
        userId,
        action: 'CREATE',
        entityType: 'API_KEY',
        entityId: created.id,
        changes: { name, permissions, expiresAt },
        createdAt: new Date(),
      });
    } catch (e) {
      // non-fatal
    }

    const token = composeToken(keyId, secretPlain);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: created.id,
          name: created.name,
          key: created.key,
          permissions: created.permissions,
          expiresAt: created.expiresAt,
          lastUsedAt: created.lastUsedAt,
          isActive: created.isActive,
          createdAt: created.createdAt,
          token, // show once
        },
        message: 'API key created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Key creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

