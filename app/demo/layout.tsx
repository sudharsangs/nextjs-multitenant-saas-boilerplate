"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { SIDEBAR_ITEMS } from "@/components/sidebar/demo-sidebar-config";
import { UserRoleEnum, SubscriptionTierEnum } from "@/lib/types";
import { Header } from "@/components/shared/header";

export default function DemoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // For demo mode, we immediately set admin role and enterprise tier without API call
    const [userRole] = useState<UserRoleEnum>(UserRoleEnum.ADMIN);
    const [subscriptionTier] = useState<SubscriptionTierEnum>(SubscriptionTierEnum.PREMIUM);
    const [collapsed, setCollapsed] = useState(false);

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