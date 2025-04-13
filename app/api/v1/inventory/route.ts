import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { inventory } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';

const inventorySchema = z.object({
  companyId: z.string(),
  locationId: z.string(),
  productId: z.string(),
  quantity: z.number(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'DAMAGED', 'QUARANTINED']),
  costPrice: z.number().optional(),
  expiryDate: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const locationId = searchParams.get('locationId');
    const productId = searchParams.get('productId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const whereClause = and(
      eq(inventory.companyId, companyId),
      eq(inventory.isActive, true),
      ...(locationId ? [eq(inventory.locationId, locationId)] : []),
      ...(productId ? [eq(inventory.productId, productId)] : [])
    );

    const inventoryList = await db.query.inventory.findMany({
      where: whereClause,
      with: {
        product: {
          columns: {
            id: true,
            name: true,
            code: true,
          },
        },
        location: {
          columns: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    return NextResponse.json(inventoryList);
  } catch (err) {
    console.error('Error in GET inventory:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const inventoryData = inventorySchema.parse(body);

    // Check if inventory entry already exists
    const existingInventory = await db.query.inventory.findFirst({
      where: and(
        eq(inventory.companyId, inventoryData.companyId),
        eq(inventory.locationId, inventoryData.locationId),
        eq(inventory.productId, inventoryData.productId),
        eq(inventory.isActive, true)
      ),
    });

    if (existingInventory) {
      // Update existing inventory
      const [updatedInventory] = await db.update(inventory)
        .set({
          quantity: existingInventory.quantity + inventoryData.quantity,
          lastMovedAt: new Date(),
        })
        .where(eq(inventory.id, existingInventory.id))
        .returning();

      return NextResponse.json(updatedInventory);
    }

    // Create new inventory entry
    const [newInventory] = await db.insert(inventory).values({
      ...inventoryData,
      lastMovedAt: new Date(),
      isActive: true,
    }).returning();

    return NextResponse.json(newInventory);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST inventory:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const inventoryId = searchParams.get('inventoryId');

    if (!inventoryId) {
      return NextResponse.json(
        { error: 'Inventory ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const inventoryData = inventorySchema.parse(body);

    const [updatedInventory] = await db.update(inventory)
      .set({
        ...inventoryData,
        lastMovedAt: new Date(),
      })
      .where(eq(inventory.id, inventoryId))
      .returning();

    return NextResponse.json(updatedInventory);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT inventory:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const inventoryId = searchParams.get('inventoryId');

    if (!inventoryId) {
      return NextResponse.json(
        { error: 'Inventory ID is required' },
        { status: 400 }
      );
    }

    await db.update(inventory)
      .set({ isActive: false })
      .where(eq(inventory.id, inventoryId));

    return NextResponse.json({ message: 'Inventory entry deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE inventory:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Inventory Transfer
export async function POST_TRANSFER(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const transferData = z.object({
      companyId: z.string(),
      fromLocationId: z.string(),
      toLocationId: z.string(),
      productId: z.string(),
      quantity: z.number(),
    }).parse(body);

    // Check if source inventory exists and has sufficient quantity
    const sourceInventory = await db.query.inventory.findFirst({
      where: and(
        eq(inventory.companyId, transferData.companyId),
        eq(inventory.locationId, transferData.fromLocationId),
        eq(inventory.productId, transferData.productId),
        eq(inventory.isActive, true)
      ),
    });

    if (!sourceInventory || sourceInventory.quantity < transferData.quantity) {
      return NextResponse.json(
        { error: 'Insufficient inventory at source location' },
        { status: 400 }
      );
    }

    // Start transaction
    await db.transaction(async (tx) => {
      // Update source inventory
      await tx.update(inventory)
        .set({
          quantity: sourceInventory.quantity - transferData.quantity,
          lastMovedAt: new Date(),
        })
        .where(eq(inventory.id, sourceInventory.id));

      // Check if destination inventory exists
      const destInventory = await tx.query.inventory.findFirst({
        where: and(
          eq(inventory.companyId, transferData.companyId),
          eq(inventory.locationId, transferData.toLocationId),
          eq(inventory.productId, transferData.productId),
          eq(inventory.isActive, true)
        ),
      });

      if (destInventory) {
        // Update destination inventory
        await tx.update(inventory)
          .set({
            quantity: destInventory.quantity + transferData.quantity,
            lastMovedAt: new Date(),
          })
          .where(eq(inventory.id, destInventory.id));
      } else {
        // Create new destination inventory
        await tx.insert(inventory).values({
          companyId: transferData.companyId,
          locationId: transferData.toLocationId,
          productId: transferData.productId,
          quantity: transferData.quantity,
          status: 'AVAILABLE',
          lastMovedAt: new Date(),
          isActive: true,
        });
      }
    });

    return NextResponse.json({ message: 'Inventory transferred successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Inventory Adjustment
export async function POST_ADJUSTMENT(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const adjustmentData = z.object({
      companyId: z.string(),
      locationId: z.string(),
      productId: z.string(),
      quantity: z.number(),
      reason: z.string(),
    }).parse(body);

    // Check if inventory exists
    const existingInventory = await db.query.inventory.findFirst({
      where: and(
        eq(inventory.companyId, adjustmentData.companyId),
        eq(inventory.locationId, adjustmentData.locationId),
        eq(inventory.productId, adjustmentData.productId),
        eq(inventory.isActive, true)
      ),
    });

    if (!existingInventory) {
      return NextResponse.json(
        { error: 'Inventory not found' },
        { status: 404 }
      );
    }

    // Update inventory quantity
    const [updatedInventory] = await db.update(inventory)
      .set({
        quantity: existingInventory.quantity + adjustmentData.quantity,
        lastMovedAt: new Date(),
      })
      .where(eq(inventory.id, existingInventory.id))
      .returning();

    // TODO: Create audit log for adjustment

    return NextResponse.json(updatedInventory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function TRANSFER(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const transferData = z.object({
      companyId: z.string(),
      fromLocationId: z.string(),
      toLocationId: z.string(),
      productId: z.string(),
      quantity: z.number(),
    }).parse(body);

    const sourceInventory = await db.query.inventory.findFirst({
      where: and(
        eq(inventory.companyId, transferData.companyId),
        eq(inventory.locationId, transferData.fromLocationId),
        eq(inventory.productId, transferData.productId),
        eq(inventory.isActive, true)
      ),
    });

    if (!sourceInventory || sourceInventory.quantity < transferData.quantity) {
      return NextResponse.json(
        { error: 'Insufficient inventory at source location' },
        { status: 400 }
      );
    }

    // Update source inventory
    await db.update(inventory)
      .set({
        quantity: sourceInventory.quantity - transferData.quantity,
        lastMovedAt: new Date(),
      })
      .where(eq(inventory.id, sourceInventory.id));

    // Update or create destination inventory
    const destinationInventory = await db.query.inventory.findFirst({
      where: and(
        eq(inventory.companyId, transferData.companyId),
        eq(inventory.locationId, transferData.toLocationId),
        eq(inventory.productId, transferData.productId),
        eq(inventory.isActive, true)
      ),
    });

    if (destinationInventory) {
      await db.update(inventory)
        .set({
          quantity: destinationInventory.quantity + transferData.quantity,
          lastMovedAt: new Date(),
        })
        .where(eq(inventory.id, destinationInventory.id));
    } else {
      await db.insert(inventory).values({
        companyId: transferData.companyId,
        locationId: transferData.toLocationId,
        productId: transferData.productId,
        quantity: transferData.quantity,
        status: 'AVAILABLE',
        lastMovedAt: new Date(),
        isActive: true,
      });
    }

    return NextResponse.json({ message: 'Inventory transferred successfully' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in TRANSFER inventory:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function COUNT(request: Request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const inventoryId = searchParams.get('inventoryId');

    if (!inventoryId) {
      return NextResponse.json(
        { error: 'Inventory ID is required' },
        { status: 400 }
      );
    }

    const inventory = await db.query.inventory.findFirst({
      where: eq(inventory.id, inventoryId),
    });

    if (!inventory) {
      return NextResponse.json(
        { error: 'Inventory not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const countData = z.object({
      quantity: z.number(),
    }).parse(body);

    const [updatedInventory] = await db.update(inventory)
      .set({
        quantity: countData.quantity,
        lastCountedAt: new Date(),
      })
      .where(eq(inventory.id, inventoryId))
      .returning();

    return NextResponse.json(updatedInventory);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in COUNT inventory:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 