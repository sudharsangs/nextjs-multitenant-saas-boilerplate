"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Dashboard overview card component
const OverviewCard = ({ title, value, icon, bgColor }: { 
  title: string;
  value: string;
  icon: string;
  bgColor: string;
}) => (
  <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`rounded-full p-2 ${bgColor}`}>
        <Image
          src={icon}
          alt={`${title} icon`}
          width={24} 
          height={24}
          className="dark:invert"
        />
      </div>
    </div>
  </div>
);

// Quick action button component
const QuickActionButton = ({ title, href, icon }: {
  title: string;
  href: string;
  icon: string;
}) => (
  <Link 
    href={href}
    className="flex items-center gap-3 p-4 hover:bg-secondary/50 rounded-md transition-colors"
  >
    <div className="bg-background rounded-full p-2 border border-border shadow-sm">
      <Image
        src={icon}
        alt={`${title} icon`}
        width={20}
        height={20}
        className="dark:invert"
      />
    </div>
    <span className="font-medium">{title}</span>
  </Link>
);

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/v1/auth/me");
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Redirect to login after a short delay
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
        }
      } catch  {
        setIsAuthenticated(false);
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Image
          src="/logo.svg" // Replace with your logo
          alt="FactoStack Logo"
          width={180}
          height={38}
          className="mb-8 dark:invert"
          priority
        />
        <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  // Show redirect message if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Image
          src="/logo.svg" // Replace with your logo
          alt="FactoStack Logo"
          width={180}
          height={38}
          className="mb-8 dark:invert"
          priority
        />
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

  // Main dashboard view for authenticated users
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Image
              src="/logo.svg" // Replace with your logo
              alt="FactoStack Logo" 
              width={120}
              height={30}
              className="dark:invert"
              priority
            />
            <nav className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
              <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">Products</Link>
              <Link href="/inventory" className="text-muted-foreground hover:text-primary transition-colors">Inventory</Link>
              <Link href="/orders" className="text-muted-foreground hover:text-primary transition-colors">Orders</Link>
              <Link href="/reports" className="text-muted-foreground hover:text-primary transition-colors">Reports</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-secondary/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
            </button>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              US
            </div>
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
            value="248" 
            icon="/globe.svg" 
            bgColor="bg-primary/10"
          />
          <OverviewCard 
            title="Low Stock Items" 
            value="12" 
            icon="/window.svg" 
            bgColor="bg-destructive/10"
          />
          <OverviewCard 
            title="Pending Orders" 
            value="36" 
            icon="/file.svg" 
            bgColor="bg-chart-1/10"
          />
          <OverviewCard 
            title="This Month Revenue" 
            value="₹3.2L" 
            icon="/file.svg" 
            bgColor="bg-chart-2/10"
          />
        </div>

        {/* Quick actions and recent activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick actions */}
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-1">
              <QuickActionButton title="Add New Product" href="/products/new" icon="/file.svg" />
              <QuickActionButton title="Create Purchase Order" href="/purchase-orders/new" icon="/file.svg" />
              <QuickActionButton title="Stock Adjustment" href="/inventory/adjust" icon="/window.svg" />
              <QuickActionButton title="Generate Reports" href="/reports" icon="/globe.svg" />
            </div>
          </div>
          
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-card rounded-lg p-6 border border-border shadow-sm">
            <h2 className="font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {[
                { action: "New order received", user: "Arun Kumar", time: "10 mins ago", status: "Order #54321" },
                { action: "Low stock alert", user: "System", time: "1 hour ago", status: "5 items" },
                { action: "Purchase order approved", user: "Priya Sharma", time: "3 hours ago", status: "PO #12345" },
                { action: "Inventory adjusted", user: "Rahul Singh", time: "Yesterday", status: "10 items" },
                { action: "New user added", user: "Admin", time: "Yesterday", status: "Role: Manager" }
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
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
          </div>
        </div>
      </main>
    </div>
  );
}
