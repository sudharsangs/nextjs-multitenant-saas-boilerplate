import React from "react";

export default function PurchasesReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Purchase Reports</h1>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Export Report
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow p-6">
        <div className="text-card-foreground">
          <p className="mb-4">View and analyze purchase metrics and reports.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-medium mb-2">Total Purchases</h3>
              <p className="text-3xl font-bold">₹0.00</p>
              <p className="text-muted-foreground mt-1">No purchase data available</p>
            </div>
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-medium mb-2">Purchase Orders</h3>
              <p className="text-3xl font-bold">0</p>
              <p className="text-muted-foreground mt-1">No orders processed</p>
            </div>
          </div>
          <div className="border rounded-md p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No purchase data available</h3>
            <p className="text-muted-foreground mb-4">Create purchase orders to generate reports.</p>
          </div>
        </div>
      </div>
    </div>
  );
}