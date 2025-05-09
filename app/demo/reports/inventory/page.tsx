import React from "react";
import { BarChart, Clock, Repeat } from "lucide-react";

export default function InventoryReportsPage() {
  const inventoryData = {
    stockValue: 285750.50,
    lowStockItems: 12,
    avgStockTurnover: 25.3,
    inventoryByCategory: [
      { category: "Raw Materials", value: 125450.00, percentage: 43.9 },
      { category: "Finished Goods", value: 98560.25, percentage: 34.5 },
      { category: "Packaging Materials", value: 37240.75, percentage: 13.0 },
      { category: "Spare Parts", value: 24499.50, percentage: 8.6 }
    ],
    lowStockProducts: [
      { name: "Steel Bolts (10mm)", code: "STL-B10", available: 25, reorderPoint: 50 },
      { name: "Circuit Board X1", code: "CBX-001", available: 8, reorderPoint: 20 },
      { name: "Aluminum Sheet (2mm)", code: "ALU-S2", available: 15, reorderPoint: 30 },
      { name: "Plastic Housing Type B", code: "PLT-HB", available: 18, reorderPoint: 25 },
      { name: "LED Bulbs 5W", code: "LED-B5W", available: 12, reorderPoint: 40 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Inventory Reports</h1>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Export Report
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow p-6">
        <div className="text-card-foreground">
          <p className="mb-4">View and analyze inventory metrics and reports.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-medium mb-2">Stock Value</h3>
              <p className="text-3xl font-bold">₹{inventoryData.stockValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
              <p className="text-muted-foreground mt-1">Total inventory value</p>
            </div>
            <div className="border rounded-md p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">Low Stock Items</h3>
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-3xl font-bold">{inventoryData.lowStockItems}</p>
              <p className="text-muted-foreground mt-1">Items below reorder point</p>
            </div>
            <div className="border rounded-md p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">Avg. Stock Turnover</h3>
                <Repeat className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold">{inventoryData.avgStockTurnover}</p>
              <p className="text-muted-foreground mt-1">Days (monthly average)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Inventory Value by Category */}
            <div className="border rounded-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">Inventory Value by Category</h3>
                <BarChart className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-4">
                {inventoryData.inventoryByCategory.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{category.category}</span>
                      <span>₹{category.value.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mb-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {category.percentage}% of total inventory
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Items */}
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-medium mb-4">Low Stock Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 text-xs">
                    <tr>
                      <th className="text-left py-2 px-2">Product</th>
                      <th className="text-left py-2 px-2">Code</th>
                      <th className="text-right py-2 px-2">Available</th>
                      <th className="text-right py-2 px-2">Reorder Point</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {inventoryData.lowStockProducts.map((product, index) => (
                      <tr key={index} className="border-b border-border">
                        <td className="py-2 px-2">{product.name}</td>
                        <td className="py-2 px-2 text-muted-foreground">{product.code}</td>
                        <td className="py-2 px-2 text-right font-medium text-amber-600">{product.available}</td>
                        <td className="py-2 px-2 text-right text-muted-foreground">{product.reorderPoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-6">
            <h3 className="text-lg font-medium mb-4">Recent Inventory Movements</h3>
            <table className="w-full">
              <thead className="bg-muted/50 text-xs">
                <tr>
                  <th className="text-left py-2 px-4">Date</th>
                  <th className="text-left py-2 px-4">Product</th>
                  <th className="text-left py-2 px-4">Type</th>
                  <th className="text-right py-2 px-4">Quantity</th>
                  <th className="text-left py-2 px-4">Location</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-border">
                  <td className="py-2 px-4">May 8, 2025</td>
                  <td className="py-2 px-4">Steel Bolts (10mm)</td>
                  <td className="py-2 px-4"><span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Stock Out</span></td>
                  <td className="py-2 px-4 text-right">-250</td>
                  <td className="py-2 px-4">Main Warehouse</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-4">May 7, 2025</td>
                  <td className="py-2 px-4">LED Bulbs 5W</td>
                  <td className="py-2 px-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Stock In</span></td>
                  <td className="py-2 px-4 text-right">+100</td>
                  <td className="py-2 px-4">Main Warehouse</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-4">May 6, 2025</td>
                  <td className="py-2 px-4">Plastic Housing Type B</td>
                  <td className="py-2 px-4"><span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Transfer</span></td>
                  <td className="py-2 px-4 text-right">50</td>
                  <td className="py-2 px-4">Main → Production</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-4">May 5, 2025</td>
                  <td className="py-2 px-4">Aluminum Sheet (2mm)</td>
                  <td className="py-2 px-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Stock In</span></td>
                  <td className="py-2 px-4 text-right">+40</td>
                  <td className="py-2 px-4">Main Warehouse</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-4">May 3, 2025</td>
                  <td className="py-2 px-4">Circuit Board X1</td>
                  <td className="py-2 px-4"><span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Stock Out</span></td>
                  <td className="py-2 px-4 text-right">-60</td>
                  <td className="py-2 px-4">Production Floor</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}