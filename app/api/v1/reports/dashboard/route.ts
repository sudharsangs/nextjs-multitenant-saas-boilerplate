import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { db } from '@/db';
import { and, count, eq, gte, lte, desc, sql } from 'drizzle-orm';
import { products, inventory, orders, purchaseOrders, vendors, auditLogs, users, locations } from '@/db/schema';

export async function GET(request: NextRequest) {
  try {
    const { companyId } = getAuthUser(request);

    // Get current date for change percentage calculation
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    const sixtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    sixtyDaysAgo.setDate(currentDate.getDate() - 60);
    
    // Fetch summary data with actual database queries
    const [
      currentInventoryResult,
      previousInventoryResult,
      pendingOrdersResult,
      previousPendingOrdersResult,
      purchaseOrdersResult,
      previousPurchaseOrdersResult,
      activeVendorsResult,
      previousActiveVendorsResult
    ] = await Promise.all([
      // Current total inventory count
      db.select({ total: sql<number>`sum(${inventory.quantity})` })
        .from(inventory)
        .where(and(
          eq(inventory.companyId, companyId),
          eq(inventory.isActive, true)
        )),
      
      // Previous period inventory count for comparison
      db.select({ total: sql<number>`sum(${inventory.quantity})` })
        .from(inventory)
        .where(and(
          eq(inventory.companyId, companyId),
          eq(inventory.isActive, true),
          lte(inventory.updatedAt, thirtyDaysAgo)
        )),
      
      // Current pending orders count
      db.select({ count: count() })
        .from(orders)
        .where(and(
          eq(orders.companyId, companyId),
          eq(orders.status, 'CONFIRMED')
        )),
      
      // Previous period pending orders count
      db.select({ count: count() })
        .from(orders)
        .where(and(
          eq(orders.companyId, companyId),
          eq(orders.status, 'CONFIRMED'),
          lte(orders.createdAt, thirtyDaysAgo),
          gte(orders.createdAt, sixtyDaysAgo)
        )),
      
      // Current purchase orders count
      db.select({ count: count() })
        .from(purchaseOrders)
        .where(and(
          eq(purchaseOrders.companyId, companyId),
          eq(purchaseOrders.status, 'PENDING_APPROVAL')
        )),
      
      // Previous period purchase orders count
      db.select({ count: count() })
        .from(purchaseOrders)
        .where(and(
          eq(purchaseOrders.companyId, companyId),
          eq(purchaseOrders.status, 'PENDING_APPROVAL'),
          lte(purchaseOrders.createdAt, thirtyDaysAgo),
          gte(purchaseOrders.createdAt, sixtyDaysAgo)
        )),
      
      // Current active vendors count
      db.select({ count: count() })
        .from(vendors)
        .where(and(
          eq(vendors.companyId, companyId),
          eq(vendors.isActive, true)
        )),
      
      // Previous period active vendors count
      db.select({ count: count() })
        .from(vendors)
        .where(and(
          eq(vendors.companyId, companyId),
          eq(vendors.isActive, true),
          lte(vendors.createdAt, thirtyDaysAgo)
        ))
    ]);

    // Calculate change percentages
    const calculateChangePercentage = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return parseFloat(((current - previous) / previous * 100).toFixed(1));
    };

    const totalInventoryCount = {
      count: Number(currentInventoryResult[0]?.total ?? 0),
      changePercentage: calculateChangePercentage(
        Number(currentInventoryResult[0]?.total ?? 0), 
        Number(previousInventoryResult[0]?.total ?? 0)
      )
    };
    
    const pendingOrdersCount = {
      count: pendingOrdersResult[0]?.count || 0,
      changePercentage: calculateChangePercentage(
        pendingOrdersResult[0]?.count || 0, 
        previousPendingOrdersResult[0]?.count || 0
      )
    };
    
    const purchaseOrdersCount = {
      count: purchaseOrdersResult[0]?.count || 0,
      changePercentage: calculateChangePercentage(
        purchaseOrdersResult[0]?.count || 0, 
        previousPurchaseOrdersResult[0]?.count || 0
      )
    };
    
    const activeVendorsCount = {
      count: activeVendorsResult[0]?.count || 0,
      changePercentage: calculateChangePercentage(
        activeVendorsResult[0]?.count || 0, 
        previousActiveVendorsResult[0]?.count || 0
      )
    };

    // Fetch real recent activities from audit logs
    const recentActivitiesData = await db.select({
      id: auditLogs.id,
      action: auditLogs.action,
      entityType: auditLogs.entityType,
      entityId: auditLogs.entityId,
      createdAt: auditLogs.createdAt,
      userId: auditLogs.userId
    })
    .from(auditLogs)
    .innerJoin(users, eq(auditLogs.userId, users.id))
    .where(eq(auditLogs.companyId, companyId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(5);
    
    // Map audit logs to readable activities
    const recentActivities = await Promise.all(recentActivitiesData.map(async (activity) => {
      const user = await db.select({ name: users.name })
        .from(users)
        .where(eq(users.id, activity.userId))
        .limit(1);
      
      const mapEntityTypeToSection = {
        'PRODUCT': 'Inventory',
        'INVENTORY': 'Inventory',
        'ORDER': 'Sales',
        'PURCHASE_ORDER': 'Purchase',
        'CUSTOMER': 'Sales',
        'VENDOR': 'Purchase',
        'LOCATION': 'Inventory',
        'BATCH': 'Inventory',
        'QUALITY_CHECK': 'Manufacturing'
      };
      
      const mapEntityTypeToLink = {
        'PRODUCT': '/inventory/products',
        'INVENTORY': '/inventory/stock',
        'ORDER': '/sales/orders',
        'PURCHASE_ORDER': '/purchases/orders',
        'CUSTOMER': '/sales/customers',
        'VENDOR': '/purchases/vendors',
        'LOCATION': '/locations',
        'BATCH': '/inventory/batches',
        'QUALITY_CHECK': '/manufacturing/quality-checks'
      };
      
      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };
      
      const type = mapEntityTypeToSection[activity.entityType as keyof typeof mapEntityTypeToSection] || 'System';
      const link = mapEntityTypeToLink[activity.entityType as keyof typeof mapEntityTypeToLink] || '/dashboard';
      
      return {
        id: activity.id,
        description: `${activity.action.charAt(0) + activity.action.slice(1).toLowerCase()} ${activity.entityType.toLowerCase().replace('_', ' ')}`,
        type,
        user: user[0]?.name || 'System',
        date: formatDate(activity.createdAt),
        status: activity.action === 'DELETE' ? 'Failed' : 'Completed',
        link
      };
    }));

    // Fetch low stock alerts - products below reorder point
    const lowStockData = await db.select({
      productId: inventory.productId,
      totalStock: sql<number>`sum(${inventory.quantity})`,
      locationId: inventory.locationId
    })
    .from(inventory)
    .groupBy(inventory.productId, inventory.locationId)
    .where(eq(inventory.companyId, companyId));
    
    // Get product and location details for the low stock items
    const lowStockWithDetails = await Promise.all(lowStockData.map(async (item) => {
      const productDetails = await db.select({
        id: products.id,
        name: products.name,
        reorderPoint: products.reorderPoint
      })
      .from(products)
      .where(eq(products.id, item.productId))
      .limit(1);
      
      const locationDetails = await db.select({
        name: locations.name
      })
      .from(locations)
      .where(eq(locations.id, item.locationId))
      .limit(1);
      
      return {
        ...item,
        productName: productDetails[0]?.name || 'Unknown Product',
        reorderPoint: productDetails[0]?.reorderPoint || 0,
        locationName: locationDetails[0]?.name || 'Unknown Location'
      };
    }));
    
    // Filter to only include items below reorder point
    const lowStockAlerts = lowStockWithDetails
      .filter(item => item.reorderPoint && item.totalStock < item.reorderPoint)
      .map((item, index) => ({
        id: index + 100,
        product: item.productName,
        currentStock: item.totalStock,
        reorderPoint: item.reorderPoint,
        location: item.locationName
      }))
      .slice(0, 5); // Limit to 5 alerts

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalInventory: {
            count: totalInventoryCount.count,
            changePercentage: totalInventoryCount.changePercentage
          },
          pendingOrders: {
            count: pendingOrdersCount.count,
            changePercentage: pendingOrdersCount.changePercentage
          },
          purchaseOrders: {
            count: purchaseOrdersCount.count,
            changePercentage: purchaseOrdersCount.changePercentage
          },
          activeVendors: {
            count: activeVendorsCount.count,
            changePercentage: activeVendorsCount.changePercentage
          }
        },
        recentActivities,
        lowStockAlerts
      }
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}