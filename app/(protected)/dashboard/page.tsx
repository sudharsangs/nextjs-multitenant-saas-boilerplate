"use client";

import React, { useEffect, useState } from "react";
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
  Loader2
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { useRouter } from "next/navigation";

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

interface DashboardData {
  summary: {
    totalInventory: {
      count: number;
      changePercentage: number;
    };
    pendingOrders: {
      count: number;
      changePercentage: number;
    };
    purchaseOrders: {
      count: number;
      changePercentage: number;
    };
    activeVendors: {
      count: number;
      changePercentage: number;
    };
  };
  recentActivities: Activity[];
  lowStockAlerts: StockAlert[];
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

// Loading Spinner Component
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-lg">Loading...</span>
    </div>
  );
};

// Error Display Component
const ErrorDisplay = ({ message, retry }: { message: string, retry: () => void }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center text-center h-64">
      <AlertCircle size={40} className="text-red-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
      <p className="text-muted-foreground mb-4 max-w-md">{message}</p>
      <button 
        onClick={retry}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
      >
        Try Again
      </button>
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

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Define the user response type
  interface UserResponse {
    user: {
      companyId?: string | null;
    };
    company?: unknown;
  }

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First, check if the user has a company
      const userResponse = await api.get<UserResponse>('/auth/me');
      
      if (userResponse.success && userResponse.data) {
        // If the user doesn't have a company, redirect to onboarding
        if (!userResponse.data.user.companyId || !userResponse.data.company) {
          router.push('/onboarding');
          return;
        }
        
        // Otherwise, fetch dashboard data
        const response = await api.get<DashboardData>('/reports/dashboard');
        
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error || 'Failed to load dashboard data');
        }
      } else {
        setError(userResponse.error || 'Failed to load user data');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Transform API data into summary cards format when data is available
  const summaryCards = data ? [
    { 
      title: "Total Inventory", 
      value: data.summary.totalInventory.count.toLocaleString(), 
      change: data.summary.totalInventory.changePercentage, 
      icon: <BoxIcon size={24} className="text-blue-500" />, 
      color: "bg-blue-100", 
      link: "/inventory/stock" 
    },
    { 
      title: "Pending Orders", 
      value: data.summary.pendingOrders.count.toLocaleString(), 
      change: data.summary.pendingOrders.changePercentage, 
      icon: <ShoppingCartIcon size={24} className="text-purple-500" />, 
      color: "bg-purple-100", 
      link: "/sales/orders" 
    },
    { 
      title: "Purchase Orders", 
      value: data.summary.purchaseOrders.count.toLocaleString(), 
      change: data.summary.purchaseOrders.changePercentage, 
      icon: <TruckIcon size={24} className="text-amber-500" />, 
      color: "bg-amber-100", 
      link: "/purchases/orders" 
    },
    { 
      title: "Active Vendors", 
      value: data.summary.activeVendors.count.toLocaleString(), 
      change: data.summary.activeVendors.changePercentage, 
      icon: <UsersIcon size={24} className="text-green-500" />, 
      color: "bg-green-100", 
      link: "/purchases/vendors" 
    },
  ] : [];

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
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorDisplay message={error} retry={fetchDashboardData} />
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>

          {/* Low Stock Alerts */}
          <div className="mt-6">
            <LowStockAlerts alerts={data.lowStockAlerts} />
          </div>
          
          {/* Recent Activities */}
          <div className="mt-6">
            <RecentActivitiesTable activities={data.recentActivities} />
          </div>
        </>
      ) : null}
    </div>
  );
}