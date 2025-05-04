"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { SIDEBAR_ITEMS } from "@/components/sidebar/sidebar-config";
import { UserRoleEnum } from "@/lib/types";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userRole, setUserRole] = useState<UserRoleEnum | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  // In a real app, this would fetch the user data from an API or context
  useEffect(() => {
    // Simulating an API call to get user data
    const fetchUserData = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch("/api/v1/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.user?.role as UserRoleEnum);
        } else {
          // Default to viewer if there's an error
          setUserRole(UserRoleEnum.ADMIN);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Default to viewer if there's an error
        setUserRole(UserRoleEnum.ADMIN);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
      <Sidebar items={SIDEBAR_ITEMS} userRole={userRole} />
      
      {/* Main content */}
      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="container p-8">
          {children}
        </div>
      </div>
    </div>
  );
}