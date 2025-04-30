import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { locations, inventory } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getToken } from '@/lib/cookies';

// Schema validation for locations
const locationSchema = z.object({
  companyId: z.string(),
  name: z.string().min(2),
  type: z.enum(['WAREHOUSE', 'FACTORY', 'STORE']),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
});

export async function GET(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const locationId = searchParams.get('locationId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Get a specific location if locationId is provided
    if (locationId) {
      const [location] = await db
        .select()
        .from(locations)
        .where(and(
          eq(locations.id, locationId),
          eq(locations.companyId, companyId)
        ))
        .limit(1);

      if (!location) {
        return NextResponse.json(
          { error: 'Location not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(location);
    }

    // Get all active locations for the company
    const locationsList = await db
      .select()
      .from(locations)
      .where(and(
        eq(locations.companyId, companyId),
        eq(locations.isActive, true)
      ));

    return NextResponse.json(locationsList);
  } catch (err) {
    console.error('Error in GET locations:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const locationData = locationSchema.parse(body);

    const [location] = await db
      .insert(locations)
      .values({
        ...locationData,
        isActive: true,
      })
      .returning();

    return NextResponse.json(location);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST locations:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');

    if (!locationId) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const locationData = locationSchema.parse(body);

    // Check if location exists
    const [existingLocation] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, locationId))
      .limit(1);

    if (!existingLocation) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    const [updatedLocation] = await db
      .update(locations)
      .set({
        ...locationData,
        updatedAt: new Date(),
      })
      .where(eq(locations.id, locationId))
      .returning();

    return NextResponse.json(updatedLocation);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }
    console.error('Error in PUT locations:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');

    if (!locationId) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    // Check if location exists
    const [existingLocation] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, locationId))
      .limit(1);

    if (!existingLocation) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Check if there's inventory in this location
    const inventoryInLocation = await db
      .select({ count: sql<number>`count(*)` })
      .from(inventory)
      .where(and(
        eq(inventory.locationId, locationId),
        eq(inventory.isActive, true)
      ));

    if (inventoryInLocation[0]?.count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete location with active inventory' },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    await db
      .update(locations)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(locations.id, locationId));

    return NextResponse.json({ message: 'Location deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE locations:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get inventory by location
export async function GET_INVENTORY(request: Request) {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');

    if (!locationId) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    const inventoryItems = await db
      .select({
        id: inventory.id,
        productId: inventory.productId,
        quantity: inventory.quantity,
        status: inventory.status,
        lastCountedAt: inventory.lastCountedAt,
        lastMovedAt: inventory.lastMovedAt,
      })
      .from(inventory)
      .where(and(
        eq(inventory.locationId, locationId),
        eq(inventory.isActive, true)
      ));

    return NextResponse.json(inventoryItems);
  } catch (err) {
    console.error('Error in GET_INVENTORY:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}