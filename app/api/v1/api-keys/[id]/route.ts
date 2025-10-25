import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/db';
import { apiKeys, auditLogs } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';

// DELETE /api/v1/api-keys/:id -> Soft revoke (isActive=false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { companyId, userId } = getAuthUser(request);
    if (!companyId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [existing] = await db
      .select({ id: apiKeys.id, isActive: apiKeys.isActive })
      .from(apiKeys)
      .where(and(eq(apiKeys.id, id), eq(apiKeys.companyId, companyId)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ success: false, error: 'API key not found' }, { status: 404 });
    }

    await db
      .update(apiKeys)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(apiKeys.id, id), eq(apiKeys.companyId, companyId)));

    // audit log (best-effort)
    try {
      await db.insert(auditLogs).values({
        companyId,
        userId,
        action: 'DELETE',
        entityType: 'API_KEY',
        entityId: id,
        createdAt: new Date(),
      });
    } catch {}

    return NextResponse.json({ success: true, message: 'API key revoked' });
  } catch (error) {
    console.error('API Key revoke error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/api-keys/:id -> Update name, permissions, or expiresAt
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { companyId } = getAuthUser(request);
    if (!companyId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updates: Partial<typeof apiKeys.$inferInsert> = {};
    if (typeof body?.name === 'string') updates.name = body.name;
    if (typeof body?.permissions !== 'undefined') updates.permissions = body.permissions;
    if (typeof body?.expiresAt !== 'undefined') {
      updates.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: 'No valid fields to update' }, { status: 400 });
    }

    updates.updatedAt = new Date();

    const result = await db
      .update(apiKeys)
      .set(updates)
      .where(and(eq(apiKeys.id, id), eq(apiKeys.companyId, companyId)))
      .returning({
        id: apiKeys.id,
        name: apiKeys.name,
        key: apiKeys.key,
        permissions: apiKeys.permissions,
        expiresAt: apiKeys.expiresAt,
        lastUsedAt: apiKeys.lastUsedAt,
        isActive: apiKeys.isActive,
        createdAt: apiKeys.createdAt,
        updatedAt: apiKeys.updatedAt,
      });

    if (!result[0]) {
      return NextResponse.json({ success: false, error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0], message: 'API key updated' });
  } catch (error) {
    console.error('API Key update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}
