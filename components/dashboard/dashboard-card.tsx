import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import Link from "next/link";

interface DashboardCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  link?: string;
}

export const DashboardCard = ({ title, value, change, icon, color, link }: DashboardCardProps) => {
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