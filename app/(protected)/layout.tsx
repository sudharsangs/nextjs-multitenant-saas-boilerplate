"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { SIDEBAR_ITEMS } from "@/components/sidebar/sidebar-config";
import { UserRoleEnum, SubscriptionTierEnum } from "@/lib/types";
import { Header } from "@/components/shared/header";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [userRole, setUserRole] = useState<UserRoleEnum | undefined>(undefined);
    const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTierEnum | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();

    // Fetch user data and check for company
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Use our API client for consistency
                const response = await api.get('/auth/me');

                if (response.success && response.data) {
                    const userData = response.data as {
                        user: {
                            role: string;
                            companyId?: string;
                        };
                    };

                    // Check if user has a company, if not redirect to onboarding
                    if (!userData.user.companyId) {
                        router.push('/onboarding');
                        return;
                    }

                    // Fetch subscription to get the plan
                    try {
                        const subResponse = await api.get('/subscriptions');
                        if (subResponse.success && subResponse.data) {
                            const subData = subResponse.data as { plan: string };
                            setSubscriptionTier(subData.plan as SubscriptionTierEnum);
                        }
                    } catch {
                        // Subscription fetch failed, but user can still use the dashboard
                    }

                    setUserRole(userData.user.role as UserRoleEnum);
                } else {
                    // Default to ADMIN if there's an error
                    setUserRole(UserRoleEnum.ADMIN);
                }
            } catch  {
                // Default to ADMIN if there's an error
                setUserRole(UserRoleEnum.ADMIN);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <Sidebar
                items={SIDEBAR_ITEMS}
                userRole={userRole}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                subscriptionTier={subscriptionTier}
            />

            {/* Main content */}
            <div className={`flex-1 ${collapsed ? "ml-[4.5rem]" : "ml-64"} overflow-y-auto`}>
                <Header />
                <div className="container mx-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}