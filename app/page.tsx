"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Package, AlertTriangle, ShoppingCart, IndianRupee, Plus, Package2, Tags, Boxes, Warehouse, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dashboard overview card component
const OverviewCard = ({ title, value, icon: Icon, bgColor }: { 
  title: string;
  value: string;
  icon: LucideIcon;
  bgColor: string;
}) => (
  <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`rounded-full p-2 ${bgColor}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

// Quick action button component
const QuickActionButton = ({ title, href, icon: Icon }: {
  title: string;
  href: string;
  icon: LucideIcon;
}) => (
  <Link 
    href={href}
    className="flex items-center gap-3 p-4 hover:bg-secondary/50 rounded-md transition-colors"
  >
    <div className="bg-background rounded-full p-2 border border-border shadow-sm">
      <Icon className="h-5 w-5" />
    </div>
    <span className="font-medium">{title}</span>
  </Link>
);

interface Activity {
  id: string;
  action: string;
  user: string;
  time: string;
  status: string;
  type: 'order' | 'stock' | 'purchase' | 'user';
}

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [overview, setOverview] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    monthlyRevenue: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/v1/auth/me");
        if (response.ok) {
          setIsAuthenticated(true);
          // Fetch dashboard data
          await Promise.all([
            fetchDashboardOverview(),
            fetchRecentActivities()
          ]);
        } else {
          setIsAuthenticated(false);
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
        }
      } catch {
        setIsAuthenticated(false);
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchDashboardOverview = async () => {
    try {
      const response = await fetch("/api/v1/dashboard/overview");
      if (response.ok) {
        const data = await response.json();
        setOverview(data);
      }
    } catch (error) {
      console.error("Error fetching overview:", error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch("/api/v1/dashboard/activities");
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  if (isLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
        <p className="text-lg text-muted-foreground mt-4">Loading your dashboard...</p>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
        <p className="text-muted-foreground mb-4">Redirecting to login page...</p>
        <Link 
          href="/auth/login"
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">FactoStack</h1>
            <nav className="hidden md:flex gap-6">
              <Link href="/inventory" className="text-foreground hover:text-primary transition-colors">Inventory</Link>
              <Link href="/inventory/products" className="text-muted-foreground hover:text-primary transition-colors">Products</Link>
              <Link href="/inventory/categories" className="text-muted-foreground hover:text-primary transition-colors">Categories</Link>
              <Link href="/inventory/batches" className="text-muted-foreground hover:text-primary transition-colors">Batches</Link>
              <Link href="/inventory/stock" className="text-muted-foreground hover:text-primary transition-colors">Stock</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome to FactoStack</h1>
          <p className="text-muted-foreground mt-1">Manage your inventory with ease and efficiency</p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <OverviewCard 
            title="Total Products" 
            value={overview.totalProducts.toString()} 
            icon={Package} 
            bgColor="bg-primary/10"
          />
          <OverviewCard 
            title="Low Stock Items" 
            value={overview.lowStockItems.toString()} 
            icon={AlertTriangle} 
            bgColor="bg-destructive/10"
          />
          <OverviewCard 
            title="Pending Orders" 
            value={overview.pendingOrders.toString()} 
            icon={ShoppingCart} 
            bgColor="bg-chart-1/10"
          />
          <OverviewCard 
            title="This Month Revenue" 
            value={`₹${overview.monthlyRevenue.toLocaleString()}`} 
            icon={IndianRupee} 
            bgColor="bg-chart-2/10"
          />
        </div>

        {/* Quick actions and recent activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick actions */}
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-1">
              <QuickActionButton title="Add New Product" href="/inventory/products/new" icon={Package2} />
              <QuickActionButton title="Add New Category" href="/inventory/categories/new" icon={Tags} />
              <QuickActionButton title="Add New Batch" href="/inventory/batches/new" icon={Boxes} />
              <QuickActionButton title="Add New Stock" href="/inventory/stock/new" icon={Warehouse} />
            </div>
          </div>
          
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-card rounded-lg p-6 border border-border shadow-sm">
            <h2 className="font-semibold mb-4">Recent Activities</h2>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">by {activity.user}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{activity.status}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No recent activities</p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/inventory/products')}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Start Managing Inventory
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
