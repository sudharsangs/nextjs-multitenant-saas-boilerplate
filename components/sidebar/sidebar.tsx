"use client";

import React, { useState, useEffect } from "react";
import { SidebarItem } from "./sidebar-item";
import { SidebarItemType, filterSidebarItemsByRoleAndSubscription } from "@/lib/sidebar";
import { UserRoleEnum, SubscriptionTierEnum } from "@/lib/types";
import { ChevronLeft, MenuIcon } from "lucide-react";

interface SidebarProps {
    items: SidebarItemType[];
    userRole?: UserRoleEnum;
    subscriptionTier?: SubscriptionTierEnum;
    defaultCollapsed?: boolean;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    items,
    userRole,
    subscriptionTier,
    defaultCollapsed = false,
    collapsed,
    setCollapsed,
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Filter sidebar items based on user role
    const filteredItems = filterSidebarItemsByRoleAndSubscription(items, userRole, subscriptionTier);

    // Handle responsive behavior
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setCollapsed(true);
            } else if (window.innerWidth >= 768) {
                setIsOpen(false);
                setCollapsed(defaultCollapsed);
            }
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);
        return () => window.removeEventListener("resize", checkIsMobile);
    }, [defaultCollapsed]);

    const toggleSidebar = () => {
        if (isMobile) {
            setIsOpen(!isOpen);
        } else {
            setCollapsed(!collapsed);
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile menu button */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground"
                    aria-label="Toggle menu"
                >
                    <MenuIcon size={20} />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-40 h-full transition-all duration-300 ease-in-out
          ${collapsed && !isOpen ? "w-[4.5rem]" : "w-64"}
          ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
          bg-sidebar border-r border-sidebar-border
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar header */}
                    <div className="flex items-center justify-between p-4 h-16 border-b border-sidebar-border">
                        {!collapsed && (
                            <div className="text-xl font-semibold flex gap-3 text-sidebar-foreground">
                                <img src="/logo.svg" alt="Logo" className="h-8" />
                                SaaS Boilerplate
                            </div>
                        )}
                        {/* Toggle button for desktop */}
                        {!isMobile && (
                            <button
                                onClick={toggleSidebar}
                                className={`p-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent ${collapsed ? "mx-auto" : ""
                                    }`}
                                aria-label="Toggle sidebar"
                            >
                                <ChevronLeft
                                    size={20}
                                    className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                        )}
                    </div>

                    {/* Sidebar content */}
                    <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
                        {filteredItems.map((item, index) => (
                            <SidebarItem key={index} item={item} collapsed={collapsed} />
                        ))}
                    </div>

                    {/* Sidebar footer */}
                    <div className="border-t border-sidebar-border p-4">
                        {!collapsed && (
                            <div className="text-xs text-sidebar-foreground opacity-70">
                                © {new Date().getFullYear()} FactoStack
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};
