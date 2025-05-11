"use client";

import React, { useEffect, useState } from "react";
import { 
  BoxIcon, 
  TruckIcon, 
  ShoppingCartIcon, 
  UsersIcon,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { EmptyState } from "@/components/shared/empty-state";
import { RecentActivitiesTable } from "@/components/dashboard/recent-activities-table";
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts";
import Link from "next/link";

interface DashboardData {
  totalProducts: number;
  productChange: number;
  pendingOrders: number;
  orderChange: number;
  purchaseOrders: number;
  purchaseChange: number;
  activeVendors: number;
  vendorChange: number;
  lowStockAlerts: Array<{
    id: number;
    product: string;
    currentStock: number;
    reorderPoint: number;
    location: string;
  }>;
  recentActivities: Array<{
    id: string;
    type: "sale" | "purchase" | "inventory" | "production";
    description: string;
    user: string;
    timestamp: string;
    status: "success" | "warning" | "error";
    link?: string;
  }>;
}

export default function ProtectedDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalProducts: 0,
    productChange: 0,
    pendingOrders: 0,
    orderChange: 0,
    purchaseOrders: 0,
    purchaseChange: 0,
    activeVendors: 0,
    vendorChange: 0,
    lowStockAlerts: [],
    recentActivities: []
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get<{ data: DashboardData }>('/reports/dashboard');
        if (response.success && response.data) {
          setDashboardData(response.data.data);
        } else {
          setError(response.error || 'Failed to load dashboard data');
        }
      } catch {
        setError('An error occurred while loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <EmptyState 
      title="Error Loading Dashboard"
      description={error}
    />;
  }

  const summaryCards = [
    { 
      title: "Total Inventory", 
      value: dashboardData?.totalProducts ?? 0, 
      change: dashboardData?.productChange ?? 0, 
      icon: <BoxIcon size={24} className="text-blue-500" />, 
      color: "bg-blue-100", 
      link: "/inventory/stock" 
    },
    { 
      title: "Pending Orders", 
      value: dashboardData?.pendingOrders ?? 0, 
      change: dashboardData?.orderChange ?? 0, 
      icon: <ShoppingCartIcon size={24} className="text-purple-500" />, 
      color: "bg-purple-100", 
      link: "/sales/orders" 
    },
    { 
      title: "Purchase Orders", 
      value: dashboardData?.purchaseOrders ?? 0, 
      change: dashboardData?.purchaseChange ?? 0, 
      icon: <TruckIcon size={24} className="text-amber-500" />, 
      color: "bg-amber-100", 
      link: "/purchases/orders" 
    },
    { 
      title: "Active Vendors", 
      value: dashboardData?.activeVendors ?? 0, 
      change: dashboardData?.vendorChange ?? 0, 
      icon: <UsersIcon size={24} className="text-green-500" />, 
      color: "bg-green-100", 
      link: "/purchases/vendors" 
    },
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
        <LowStockAlerts alerts={dashboardData?.lowStockAlerts ?? []} />
      </div>
      
      {/* Recent Activities */}
      <div className="mt-6">
        <RecentActivitiesTable activities={dashboardData?.recentActivities ?? []} />
      </div>
    </div>
  );
}