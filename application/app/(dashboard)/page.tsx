import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/dashboard/overview';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { InventoryAlerts } from '@/components/dashboard/inventory-alerts';
import { DashboardShell } from '@/components/dashboard/shell';
import { DashboardHeader } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        description="Overview of your business operations"
      >
        <div className="flex space-x-2">
          <Link href="/orders/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </Link>
        </div>
      </DashboardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <OrderMetrics />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <RevenueMetrics />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <LowStockMetrics />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <ShipmentMetrics />
            </Suspense>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Sales and inventory overview for the current month
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest orders across all channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOrders />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>
              Low stock and reorder notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryAlerts />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

async function OrderMetrics() {
  const session = await getServerSession(authOptions);
  if (!session) return <div className="text-2xl font-bold">0</div>;

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
    select: { companyId: true }
  });

  if (!user) return <div className="text-2xl font-bold">0</div>;

  const totalOrders = await prisma.order.count({
    where: { companyId: user.companyId }
  });

  // Get previous period for comparison
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  
  const previousPeriodOrders = await prisma.order.count({
    where: {
      companyId: user.companyId,
      createdAt: {
        lt: lastMonth
      }
    }
  });

  const trend = totalOrders > previousPeriodOrders;

  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold">{totalOrders}</div>
      {trend ? (
        <div className="flex items-center text-sm text-green-500">
          <TrendingUp className="mr-1 h-4 w-4" />
          <span>Increasing</span>
        </div>
      ) : (
        <div className="flex items-center text-sm text-red-500">
          <TrendingDown className="mr-1 h-4 w-4" />
          <span>Decreasing</span>
        </div>
      )}
    </div>
  );
}

async function RevenueMetrics() {
  const session = await getServerSession(authOptions);
  if (!session) return <div className="text-2xl font-bold">$0</div>;

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
    select: { companyId: true }
  });

  if (!user) return <div className="text-2xl font-bold">$0</div>;

  const orders = await prisma.order.findMany({
    where: { companyId: user.companyId },
    select: { totalAmount: true }
  });

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
      <div className="flex items-center text-sm text-green-500">
        <TrendingUp className="mr-1 h-4 w-4" />
        <span>+12.5%</span>
      </div>
    </div>
  );
}

async function LowStockMetrics() {
  const session = await getServerSession(authOptions);
  if (!session) return <div className="text-2xl font-bold">0</div>;

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
    select: { companyId: true }
  });

  if (!user) return <div className="text-2xl font-bold">0</div>;

  const lowStockItems = await prisma.inventory.count({
    where: {
      product: {
        companyId: user.companyId
      },
      quantityAvailable: {
        lte: 10 // Assuming low stock threshold
      }
    }
  });

  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold">{lowStockItems}</div>
      {lowStockItems > 0 ? (
        <div className="flex items-center text-sm text-amber-500">
          <span>Needs attention</span>
        </div>
      ) : (
        <div className="flex items-center text-sm text-green-500">
          <span>All good</span>
        </div>
      )}
    </div>
  );
}

async function ShipmentMetrics() {
  const session = await getServerSession(authOptions);
  if (!session) return <div className="text-2xl font-bold">0</div>;

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
    select: { companyId: true }
  });

  if (!user) return <div className="text-2xl font-bold">0</div>;

  const pendingShipments = await prisma.shipment.count({
    where: {
      order: {
        companyId: user.companyId
      },
      status: 'pending'
    }
  });

  return (
    <div className="flex flex-col">
      <div className="text-2xl font-bold">{pendingShipments}</div>
      {pendingShipments > 0 ? (
        <div className="flex items-center text-sm text-amber-500">
          <span>Needs attention</span>
        </div>
      ) : (
        <div className="flex items-center text-sm text-green-500">
          <span>All good</span>
        </div>
      )}
    </div>
  );
} 