"use client";

import React from "react";
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  BoxIcon, 
  TruckIcon, 
  ShoppingCartIcon, 
  UsersIcon,
  AlertCircle,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import {
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import Link from "next/link";

// Type definitions
interface DashboardCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  link?: string;
}

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

interface Activity {
  id: number;
  description: string;
  type: string;
  user: string;
  date: string;
  status: string;
  link: string;
}

interface RecentActivitiesTableProps {
  activities: Activity[];
}

interface StockAlert {
  id: number;
  product: string;
  currentStock: number;
  reorderPoint: number;
  location: string;
}

interface LowStockAlertsProps {
  alerts: StockAlert[];
}

// Dashboard Card Component
const DashboardCard = ({ title, value, change, icon, color, link }: DashboardCardProps) => {
  const isPositive = change > 0;
  
  return (
    <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          <div className="flex items-center mt-2">
            <span className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUpIcon size={14} className="mr-1" /> : <ArrowDownIcon size={14} className="mr-1" />}
              {Math.abs(change)}%
            </span>
            <span className="text-muted-foreground text-sm ml-1">from last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${color}`}>
          {icon}
        </div>
      </div>
      {link && (
        <div className="mt-4 pt-4 border-t border-border">
          <Link href={link} className="text-sm text-primary hover:underline flex items-center">
            View details
          </Link>
        </div>
      )}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ title, description, actionLabel, actionLink }: EmptyStateProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6 border border-border flex flex-col items-center justify-center text-center h-64">
      <AlertCircle size={40} className="text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{description}</p>
      {actionLabel && actionLink && (
        <Link 
          href={actionLink}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
        >
          <Plus size={16} className="mr-2" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

// Table for Recent Activities
const RecentActivitiesTable = ({ activities }: RecentActivitiesTableProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h3 className="text-lg font-medium">Recent Activities</h3>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal size={18} />
        </button>
      </div>
      {activities.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Activity</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity: Activity) => (
                <tr key={activity.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-4 text-sm">{activity.description}</td>
                  <td className="p-4 text-sm">{activity.type}</td>
                  <td className="p-4 text-sm">{activity.user}</td>
                  <td className="p-4 text-sm">{activity.date}</td>
                  <td className="p-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'Completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'
                        : activity.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <Link href={activity.link} className="text-primary hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6">
          <EmptyState 
            title="No recent activities" 
            description="There are no recent activities to display"
            actionLabel="View All Activities"
            actionLink="/audit-logs"
          />
        </div>
      )}
    </div>
  );
};

// Low Stock Alerts
const LowStockAlerts = ({ alerts }: LowStockAlertsProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h3 className="text-lg font-medium">Low Stock Alerts</h3>
        <Link href="/inventory/stock" className="text-primary hover:underline text-sm">
          View All
        </Link>
      </div>
      {alerts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Current Stock</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Reorder Point</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Location</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert: StockAlert) => (
                <tr key={alert.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-4 text-sm font-medium">{alert.product}</td>
                  <td className="p-4 text-sm text-red-500 font-medium">{alert.currentStock}</td>
                  <td className="p-4 text-sm">{alert.reorderPoint}</td>
                  <td className="p-4 text-sm">{alert.location}</td>
                  <td className="p-4 text-sm">
                    <Link href={`/purchases/orders/new?productId=${alert.id}`} className="text-primary hover:underline">
                      Create PO
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6">
          <EmptyState 
            title="No low stock alerts" 
            description="All your inventory items are above their reorder points"
          />
        </div>
      )}
    </div>
  );
};

// Mock data for dashboard statistics
const mockStats = {
  inventoryValue: 345780.50,
  lowStockItems: 8,
  pendingOrders: 12,
  pendingShipments: 7,
  thisMonthRevenue: 78690.25,
  lastMonthRevenue: 62450.80,
  thisMonthPurchases: 42580.35,
  lastMonthPurchases: 39870.20,
  totalProducts: 143,
  totalVendors: 28,
  totalCustomers: 52
};

// Mock data for inventory by category
const mockInventoryByCategory = [
  { name: 'Electronics', value: 45 },
  { name: 'Raw Materials', value: 32 },
  { name: 'Packaging', value: 21 },
  { name: 'Furniture', value: 18 },
  { name: 'Equipment', value: 27 }
];

// Mock data for sales performance
const mockSalesData = [
  { month: 'Jan', revenue: 42000 },
  { month: 'Feb', revenue: 47500 },
  { month: 'Mar', revenue: 54200 },
  { month: 'Apr', revenue: 62450 },
  { month: 'May', revenue: 78690 }
];

// Mock data for top-selling products
const mockTopSellingProducts = [
  { name: 'Premium Office Chair', sales: 87, revenue: 17391.13 },
  { name: 'LED Desk Lamp', sales: 135, revenue: 6176.25 },
  { name: 'Wireless Mouse', sales: 192, revenue: 6910.08 },
  { name: 'Ergonomic Keyboard', sales: 76, revenue: 6836.20 }
];

// Mock data for recent activities
const mockRecentActivities = [
  { id: 1, type: 'order', description: 'New order #SO-2025-107 from Innovative Solutions Inc', timestamp: '2025-05-09 09:35 AM' },
  { id: 2, type: 'inventory', description: 'Low stock alert: Steel Bolts (10mm) below threshold', timestamp: '2025-05-08 04:22 PM' },
  { id: 3, type: 'purchase', description: 'Purchase order #PO-2025-006 sent to Raw Materials Co.', timestamp: '2025-05-08 02:17 PM' },
  { id: 4, type: 'shipment', description: 'Order #SO-2025-102 marked as shipped', timestamp: '2025-05-08 10:45 AM' },
  { id: 5, type: 'inventory', description: 'Stock adjustment: Filing Cabinet +5 units', timestamp: '2025-05-07 03:30 PM' },
];

// Mock data for warehouse utilization
const mockWarehouseUtilization = [
  { location: 'Main Warehouse', utilized: 72, available: 28 },
  { location: 'East Facility', utilized: 85, available: 15 },
  { location: 'West Facility', utilized: 60, available: 40 }
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  // Calculate month-over-month changes
  const revenueChange = ((mockStats.thisMonthRevenue - mockStats.lastMonthRevenue) / mockStats.lastMonthRevenue) * 100;

  // Dummy data for dashboard
  const summaryCards = [
    { 
      title: "Total Inventory", 
      value: "1,234", 
      change: 5.2, 
      icon: <BoxIcon size={24} className="text-blue-500" />, 
      color: "bg-blue-100", 
      link: "/inventory/stock" 
    },
    { 
      title: "Pending Orders", 
      value: "42", 
      change: -2.5, 
      icon: <ShoppingCartIcon size={24} className="text-purple-500" />, 
      color: "bg-purple-100", 
      link: "/sales/orders" 
    },
    { 
      title: "Purchase Orders", 
      value: "18", 
      change: 12.3, 
      icon: <TruckIcon size={24} className="text-amber-500" />, 
      color: "bg-amber-100", 
      link: "/purchases/orders" 
    },
    { 
      title: "Active Vendors", 
      value: "56", 
      change: 0.8, 
      icon: <UsersIcon size={24} className="text-green-500" />, 
      color: "bg-green-100", 
      link: "/purchases/vendors" 
    },
  ];

  // Dummy data for recent activities
  const recentActivities = [
    {
      id: 1,
      description: "Stock adjustment",
      type: "Inventory",
      user: "John Doe",
      date: "2025-05-04",
      status: "Completed",
      link: "/inventory/stock"
    },
    {
      id: 2,
      description: "New purchase order created",
      type: "Purchase",
      user: "Jane Smith",
      date: "2025-05-03",
      status: "Pending",
      link: "/purchases/orders"
    },
    {
      id: 3,
      description: "Order shipped",
      type: "Sales",
      user: "Robert Brown",
      date: "2025-05-03",
      status: "Completed",
      link: "/sales/orders"
    },
    {
      id: 4,
      description: "New product added",
      type: "Inventory",
      user: "Alice Johnson",
      date: "2025-05-02",
      status: "Completed",
      link: "/inventory/products"
    },
    {
      id: 5,
      description: "Quality check failed",
      type: "Manufacturing",
      user: "David Lee",
      date: "2025-05-01",
      status: "Failed",
      link: "/manufacturing/quality-checks"
    }
  ];

  // Dummy data for low stock alerts
  const lowStockAlerts = [
    {
      id: 101,
      product: "Steel Bolts (10mm)",
      currentStock: 25,
      reorderPoint: 50,
      location: "Warehouse A"
    },
    {
      id: 102,
      product: "Aluminum Sheet (2mm)",
      currentStock: 5,
      reorderPoint: 20,
      location: "Factory Floor"
    },
    {
      id: 103,
      product: "Plastic Housing Type B",
      currentStock: 12,
      reorderPoint: 30,
      location: "Warehouse B"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Link 
            href="/inventory/stock" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
          >
            Add Inventory
          </Link>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>

      {/* Low Stock Alerts */}
      <div className="mt-6">
        <LowStockAlerts alerts={lowStockAlerts} />
      </div>
      
      {/* Recent Activities */}
      <div className="mt-6">
        <RecentActivitiesTable activities={recentActivities} />
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Inventory Value
          </div>
          <div className="mt-1 text-2xl font-bold">
            ${mockStats.inventoryValue.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Total value across all warehouses
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Revenue (This Month)
          </div>
          <div className="mt-1 text-2xl font-bold">
            ${mockStats.thisMonthRevenue.toLocaleString()}
          </div>
          <div className={`text-xs mt-1 ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}% from last month
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Low Stock Items
          </div>
          <div className="mt-1 text-2xl font-bold">
            {mockStats.lowStockItems}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Items below reorder threshold
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Pending Orders
          </div>
          <div className="mt-1 text-2xl font-bold">
            {mockStats.pendingOrders}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Orders waiting to be fulfilled
          </div>
        </div>
      </div>
      
      {/* Sales Performance & Inventory by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales Performance Chart */}
        <div className="bg-card rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Sales Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockSalesData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Inventory by Category */}
        <div className="bg-card rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Inventory by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockInventoryByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockInventoryByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Top Selling Products & Warehouse Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Selling Products */}
        <div className="bg-card rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Top Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium">Product</th>
                  <th className="px-4 py-2 text-right font-medium">Units Sold</th>
                  <th className="px-4 py-2 text-right font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {mockTopSellingProducts.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2 text-right">{product.sales}</td>
                    <td className="px-4 py-2 text-right">${product.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Warehouse Utilization */}
        <div className="bg-card rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Warehouse Utilization</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockWarehouseUtilization}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="location" />
                <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                <Legend />
                <Bar dataKey="utilized" stackId="a" fill="#8884d8" name="Utilized Space (%)" />
                <Bar dataKey="available" stackId="a" fill="#82ca9d" name="Available Space (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activities */}
      <div className="bg-card rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-2">Recent Activities</h3>
        <div className="flow-root">
          <ul className="space-y-4">
            {mockRecentActivities.map((activity) => (
              <li key={activity.id} className="py-2 border-b last:border-0">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm">{activity.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}