import React from "react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";

interface Activity {
  id: string;
  type: "sale" | "purchase" | "inventory" | "production";
  description: string;
  user: string;
  timestamp: string;
  status: "success" | "warning" | "error";
  link?: string;
}

interface RecentActivitiesTableProps {
  activities: Activity[];
}

export const RecentActivitiesTable = ({ activities }: RecentActivitiesTableProps) => {
  const getStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-amber-500";
      case "error":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h3 className="text-lg font-medium">Recent Activities</h3>
      </div>
      {activities.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Activity</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-4 text-sm">
                    {activity.link ? (
                      <Link href={activity.link} className="hover:underline">
                        {activity.description}
                      </Link>
                    ) : (
                      activity.description
                    )}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{activity.user}</td>
                  <td className="p-4 text-sm text-muted-foreground">{activity.timestamp}</td>
                  <td className="p-4 text-sm">
                    <span className={getStatusColor(activity.status)}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6">
          <EmptyState 
            title="No recent activities" 
            description="Activities will appear here as you use the system"
          />
        </div>
      )}
    </div>
  );
};