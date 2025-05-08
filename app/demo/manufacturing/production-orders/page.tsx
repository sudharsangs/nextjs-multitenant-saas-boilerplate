import React from "react";

export default function ProductionOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Production Orders</h1>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Create Order
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow p-6">
        <div className="text-card-foreground">
          <p className="mb-4">Manage your production orders here.</p>
          <div className="border rounded-md p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No production orders found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first production order.</p>
          </div>
        </div>
      </div>
    </div>
  );
}