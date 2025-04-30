import { NextResponse } from 'next/server';
import { db } from '@/db';
import { inventory, products, locations } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);
    const { searchParams } = new URL(request.url);
    const requestedCompanyId = searchParams.get('companyId');
    const locationId = searchParams.get('locationId');
    const productId = searchParams.get('productId');
    
    if (!requestedCompanyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Verify that the user has access to the requested company
    if (requestedCompanyId !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized access to company data' },
        { status: 403 }
      );
    }

    // Base conditions for all queries
    const whereConditions = [
      eq(inventory.companyId, companyId),
      eq(inventory.isActive, true)
    ];
    
    if (locationId) {
      whereConditions.push(eq(inventory.locationId, locationId));
    }
    
    if (productId) {
      whereConditions.push(eq(inventory.productId, productId));
    }

    // Get detailed inventory
    const inventoryItems = await db
      .select({
        id: inventory.id,
        productId: inventory.productId,
        locationId: inventory.locationId,
        quantity: inventory.quantity,
        status: inventory.status,
        lastCountedAt: inventory.lastCountedAt,
        lastMovedAt: inventory.lastMovedAt,
        product: {
          name: products.name,
          code: products.code,
          unit: products.unit
        },
        location: {
          name: locations.name,
          type: locations.type
        }
      })
      .from(inventory)
      .leftJoin(products, eq(inventory.productId, products.id))
      .leftJoin(locations, eq(inventory.locationId, locations.id))
      .where(and(...whereConditions));

    // Get summary by product
    const productSummary = await db
      .select({
        productId: inventory.productId,
        productName: products.name,
        productCode: products.code,
        totalQuantity: sql`SUM(${inventory.quantity})`,
        locationCount: sql`COUNT(DISTINCT ${inventory.locationId})`
      })
      .from(inventory)
      .leftJoin(products, eq(inventory.productId, products.id))
      .where(and(...whereConditions))
      .groupBy(inventory.productId, products.name, products.code);

    // Get summary by location
    const locationSummary = await db
      .select({
        locationId: inventory.locationId,
        locationName: locations.name,
        locationType: locations.type,
        totalQuantity: sql`SUM(${inventory.quantity})`,
        productCount: sql`COUNT(DISTINCT ${inventory.productId})`
      })
      .from(inventory)
      .leftJoin(locations, eq(inventory.locationId, locations.id))
      .where(and(...whereConditions))
      .groupBy(inventory.locationId, locations.name, locations.type);

    // Get total inventory value if cost price is available
    const inventoryValue = await db
      .select({
        totalValue: sql`SUM(${inventory.quantity} * ${inventory.costPrice}::decimal)`
      })
      .from(inventory)
      .where(and(...whereConditions));

    return NextResponse.json({
      items: inventoryItems,
      productSummary,
      locationSummary,
      inventoryValue: inventoryValue[0]?.totalValue || 0,
      generatedAt: new Date(),
    });
  } catch (err) {
    console.error('Error generating inventory report:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}