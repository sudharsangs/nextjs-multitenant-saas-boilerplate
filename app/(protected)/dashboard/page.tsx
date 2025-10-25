"use client";

import React, { useEffect, useState } from "react";
import {
  UsersIcon,
  BellIcon,
  KeyIcon,
  ShieldIcon,
} from "lucide-react";
import { api } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  notifications: number;
  apiKeys: number;
  company: {
    name: string;
    plan: string;
    users: number;
  };
}

export default function ProtectedDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get<{ data: DashboardData }>('/dashboard/overview');
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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Users",
      value: dashboardData?.totalUsers ?? 0,
      description: `${dashboardData?.activeUsers ?? 0} active users`,
      icon: <UsersIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Notifications",
      value: dashboardData?.notifications ?? 0,
      description: "Unread notifications",
      icon: <BellIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "API Keys",
      value: dashboardData?.apiKeys ?? 0,
      description: "Active API keys",
      icon: <KeyIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Security",
      value: "Active",
      description: "All systems operational",
      icon: <ShieldIcon className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's your company overview.
          </p>
        </div>
      </div>

      {/* Company Info */}
      {dashboardData?.company && (
        <Card>
          <CardHeader>
            <CardTitle>{dashboardData.company.name}</CardTitle>
            <CardDescription>
              Plan: {dashboardData.company.plan} • {dashboardData.company.users} users
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Quick actions to set up your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Complete your profile</p>
              <p className="text-sm text-muted-foreground">
                Add company information and preferences
              </p>
            </div>
            <a
              href="/settings/company"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-9 px-4 hover:bg-primary/90"
            >
              Setup
            </a>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Invite team members</p>
              <p className="text-sm text-muted-foreground">
                Collaborate with your team
              </p>
            </div>
            <a
              href="/settings/users"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-9 px-4 hover:bg-primary/90"
            >
              Invite
            </a>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Configure integrations</p>
              <p className="text-sm text-muted-foreground">
                Connect your favorite tools
              </p>
            </div>
            <a
              href="/settings/integrations"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-9 px-4 hover:bg-primary/90"
            >
              Connect
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
