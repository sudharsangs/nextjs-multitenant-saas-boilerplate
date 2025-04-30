import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { inventory } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getToken } from '@/lib/cookies';

// Schema validation for inventory updates
const inventoryUpdateSchema = z.object({
  locationId: z.string().optional(),
  quantity: z.number().optional(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'DAMAGED', 'QUARANTINED']).optional(),
  costPrice: z.number().optional(),
  expiryDate: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const inventoryId = params.id;

    const [inventoryItem] = await db
      .select({
        id: inventory.id,
        companyId: inventory.companyId,
        locationId: inventory.locationId,
        productId: inventory.productId,
        batchId: inventory.batchId,
        quantity: inventory.quantity,
        status: inventory.status,
        costPrice: inventory.costPrice,
        expiryDate: inventory.expiryDate,
        lastCountedAt: inventory.lastCountedAt,
        lastMovedAt: inventory.lastMovedAt,
        isActive: inventory.isActive,
        createdAt: inventory.createdAt,
        updatedAt: inventory.updatedAt,
      })
      .from(inventory)
      .where(eq(inventory.id, inventoryId))
      .limit(1);

    if (!inventoryItem) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(inventoryItem);
  } catch (err) {
    console.error('Error in GET inventory item:', err);
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
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const inventoryId = params.id;
    const body = await request.json();
    const { locationId, quantity, status, costPrice, expiryDate } = inventoryUpdateSchema.parse(body);

    // Check if inventory item exists
    const [existingInventory] = await db
      .select()
      .from(inventory)
      .where(eq(inventory.id, inventoryId))
      .limit(1);

    if (!existingInventory) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    // Prepare update values
    const updateValues: Record<string, unknown> = {
      updatedAt: new Date()
    };

    if (locationId !== undefined) updateValues.locationId = locationId;
    if (quantity !== undefined) updateValues.quantity = quantity;
    if (status !== undefined) updateValues.status = status;
    if (costPrice !== undefined) updateValues.costPrice = costPrice;
    if (expiryDate !== undefined) updateValues.expiryDate = new Date(expiryDate);

    // If quantity is updated, update the lastMovedAt timestamp
    if (quantity !== undefined) {
      updateValues.lastMovedAt = new Date();
    }

    const [updatedInventory] = await db
      .update(inventory)
      .set(updateValues)
      .where(eq(inventory.id, inventoryId))
      .returning({
        id: inventory.id,
        companyId: inventory.companyId,
        locationId: inventory.locationId,
        productId: inventory.productId,
        batchId: inventory.batchId,
        quantity: inventory.quantity,
        status: inventory.status,
        costPrice: inventory.costPrice,
        expiryDate: inventory.expiryDate,
        lastCountedAt: inventory.lastCountedAt,
        lastMovedAt: inventory.lastMovedAt,
        isActive: inventory.isActive,
        updatedAt: inventory.updatedAt,
      });

    return NextResponse.json(updatedInventory);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT inventory item:', err);
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
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const inventoryId = params.id;

    // Check if inventory item exists
    const [existingInventory] = await db
      .select()
      .from(inventory)
      .where(eq(inventory.id, inventoryId))
      .limit(1);

    if (!existingInventory) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await db
      .update(inventory)
      .set({ 
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(inventory.id, inventoryId));

    return NextResponse.json({ message: 'Inventory item deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE inventory item:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}