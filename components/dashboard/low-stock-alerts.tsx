import React from "react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";

interface StockAlert {
  id: number;
  product: string;
  currentStock: number;
  reorderPoint: number;
  location: string;
}

interface LowStockAlertsProps {
  alerts: StockAlert[];
}

export const LowStockAlerts = ({ alerts }: LowStockAlertsProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h3 className="text-lg font-medium">Low Stock Alerts</h3>
        <Link href="/inventory/stock" className="text-primary hover:underline text-sm">
          View All
        </Link>
      </div>
      {alerts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Current Stock</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Reorder Point</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Location</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert: StockAlert) => (
                <tr key={alert.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-4 text-sm font-medium">{alert.product}</td>
                  <td className="p-4 text-sm text-red-500 font-medium">{alert.currentStock}</td>
                  <td className="p-4 text-sm">{alert.reorderPoint}</td>
                  <td className="p-4 text-sm">{alert.location}</td>
                  <td className="p-4 text-sm">
                    <Link href={`/purchases/orders/new?productId=${alert.id}`} className="text-primary hover:underline">
                      Create PO
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6">
          <EmptyState 
            title="No low stock alerts" 
            description="All your inventory items are above their reorder points"
          />
        </div>
      )}
    </div>
  );
};