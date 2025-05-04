"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { SidebarItemType } from "@/lib/sidebar";

interface SidebarItemProps {
  item: SidebarItemType;
  collapsed: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, collapsed }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle nested items
  const hasChildren = item.children && item.children.length > 0;
  
  const toggleDropdown = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  // Determine if any child is active (for highlighting parent items)
  const isChildActive = hasChildren && item.children?.some(
    child => pathname === child.href
  );
  
  // Auto-expand dropdown if a child is active
  React.useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive, pathname]);

  return (
    <div className={`${hasChildren ? "mb-2" : ""}`}>
      <Link
        href={hasChildren ? "#" : item.href}
        onClick={toggleDropdown}
        className={`
          flex items-center p-2 rounded-md group transition-colors
          ${isActive || isChildActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary/50"}
          ${collapsed ? "justify-center" : "justify-between"}
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`${isActive || isChildActive ? "text-primary-foreground" : "text-foreground"}`}>
            {item.icon}
          </div>
          {!collapsed && <span className="font-medium">{item.title}</span>}
        </div>

        {/* Badge (if any) */}
        {!collapsed && item.badge && (
          <div className="min-w-5 h-5 flex items-center justify-center bg-primary/20 text-primary rounded px-1.5 text-xs font-medium">
            {item.badge}
          </div>
        )}
        
        {/* Dropdown arrow for nested items */}
        {!collapsed && hasChildren && (
          <div className={`ml-auto transform transition-transform ${isOpen ? "rotate-180" : ""}`}>
            <ChevronDown size={16} />
          </div>
        )}
      </Link>

      {/* Dropdown menu (child items) */}
      {hasChildren && isOpen && !collapsed && (
        <div className="pl-6 mt-1 space-y-1">
          {item.children?.map((child, index) => (
            <Link
              key={index}
              href={child.href}
              className={`
                flex items-center p-2 rounded-md text-sm transition-colors
                ${pathname === child.href 
                  ? "bg-secondary text-secondary-foreground" 
                  : "hover:bg-secondary/50"}
              `}
            >
              <div className="flex items-center gap-3">
                {child.icon}
                <span>{child.title}</span>
              </div>
              
              {child.badge && (
                <div className="ml-auto min-w-5 h-5 flex items-center justify-center bg-primary/20 text-primary rounded px-1.5 text-xs font-medium">
                  {child.badge}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};