import React from "react";

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vendors</h1>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Add Vendor
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow p-6">
        <div className="text-card-foreground">
          <p className="mb-4">Manage your vendors and suppliers here.</p>
          <div className="border rounded-md p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No vendors found</h3>
            <p className="text-muted-foreground mb-4">Get started by adding your first vendor.</p>
          </div>
        </div>
      </div>
    </div>
  );
}