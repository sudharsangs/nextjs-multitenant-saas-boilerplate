import React from "react";
import { ArrowUp, ArrowDown, TrendingUp, Users } from "lucide-react";
import PurchasesChart from "../../../../components/charts/PurchasesChart";

export default function PurchasesReportsPage() {
  const purchasesData = {
    totalPurchases: 356750.25,
    orders: 42,
    avgOrderValue: 8494.05,
    monthlyTrend: [
      { month: "Dec", value: 187500 },
      { month: "Jan", value: 212450 },
      { month: "Feb", value: 243800 },
      { month: "Mar", value: 287600 },
      { month: "Apr", value: 325200 },
      { month: "May", value: 356750 }
    ],
    topProducts: [
      { name: "Circuit Board X1", quantity: 480, amount: 168120.00, growth: 15.2 },
      { name: "Aluminum Sheet (2mm)", quantity: 320, amount: 56160.00, growth: 8.5 },
      { name: "Plastic Housing Type B", quantity: 350, amount: 42262.50, growth: 5.7 },
      { name: "Steel Bolts (10mm)", quantity: 2500, amount: 37500.00, growth: -2.3 },
      { name: "LED Bulbs 5W", quantity: 1200, amount: 27000.00, growth: 7.8 }
    ],
    topVendors: [
      { name: "Electronics Suppliers Co.", amount: 168120.00, orders: 8 },
      { name: "MetalWorks Inc", amount: 93660.00, orders: 12 },
      { name: "Global Plastics Ltd", amount: 42262.50, orders: 7 },
      { name: "Industrial Components Ltd", amount: 37500.00, orders: 9 },
      { name: "Lighting Solutions Inc", amount: 27000.00, orders: 6 }
    ],
    recentOrders: [
      { poNumber: "PO-2025-0015", vendor: "Electronics Suppliers Co.", date: "May 8, 2025", amount: 42030.00, status: "RECEIVED" },
      { poNumber: "PO-2025-0014", vendor: "MetalWorks Inc", date: "May 7, 2025", amount: 22464.00, status: "IN_TRANSIT" },
      { poNumber: "PO-2025-0013", vendor: "Global Plastics Ltd", date: "May 5, 2025", amount: 18112.50, status: "PENDING" },
      { poNumber: "PO-2025-0012", vendor: "Lighting Solutions Inc", date: "May 3, 2025", amount: 13500.00, status: "RECEIVED" },
      { poNumber: "PO-2025-0011", vendor: "Industrial Components Ltd", date: "May 1, 2025", amount: 12500.00, status: "RECEIVED" }
    ]
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "RECEIVED": return "bg-green-100 text-green-800";
      case "IN_TRANSIT": return "bg-amber-100 text-amber-800";
      case "PENDING": return "bg-blue-100 text-blue-800";
      case "CANCELLED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-medium mb-2">Total Purchases</h3>
              <p className="text-3xl font-bold">₹{purchasesData.totalPurchases.toLocaleString('en-IN')}</p>
              <div className="flex items-center text-green-600 mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+9.7% from last month</span>
              </div>
            </div>
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-medium mb-2">Purchase Orders</h3>
              <p className="text-3xl font-bold">{purchasesData.orders}</p>
              <div className="flex items-center text-green-600 mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+7 from last month</span>
              </div>
            </div>
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-medium mb-2">Avg. Order Value</h3>
              <p className="text-3xl font-bold">₹{purchasesData.avgOrderValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
              <div className="flex items-center text-green-600 mt-1">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+3.2% from last month</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Purchase Trend Chart */}
            <div className="border rounded-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-medium">Monthly Purchase Trend</h3>
                  <p className="text-sm text-muted-foreground">Total spent: ₹{purchasesData.monthlyTrend.reduce((sum, month) => sum + month.value, 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                  <span className="text-green-600 text-sm font-medium">+{((purchasesData.monthlyTrend[5].value - purchasesData.monthlyTrend[0].value) / purchasesData.monthlyTrend[0].value * 100).toFixed(1)}% increase</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Dec - May</p>
                </div>
              </div>
              <div className="h-64">
                <PurchasesChart data={purchasesData.monthlyTrend} />
              </div>
            </div>

            {/* Top Vendors */}
            <div className="border rounded-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">Top Vendors</h3>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-4">
                {purchasesData.topVendors.map((vendor, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground">{vendor.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{vendor.amount.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-muted-foreground">{((vendor.amount / purchasesData.totalPurchases) * 100).toFixed(1)}% of purchases</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border rounded-md p-6 mb-8">
            <h3 className="text-lg font-medium mb-4">Most Purchased Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-xs font-medium text-muted-foreground">
                    <th className="text-left py-2 px-4">Product</th>
                    <th className="text-right py-2 px-4">Quantity</th>
                    <th className="text-right py-2 px-4">Amount</th>
                    <th className="text-right py-2 px-4">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {purchasesData.topProducts.map((product, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-2 px-4 font-medium">{product.name}</td>
                      <td className="py-2 px-4 text-right">{product.quantity}</td>
                      <td className="py-2 px-4 text-right">₹{product.amount.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-4 text-right">
                        <div className="flex items-center justify-end">
                          {product.growth > 0 ? (
                            <>
                              <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                              <span className="text-green-600">{product.growth}%</span>
                            </>
                          ) : (
                            <>
                              <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                              <span className="text-red-600">{Math.abs(product.growth)}%</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border rounded-md p-6">
            <h3 className="text-lg font-medium mb-4">Recent Purchase Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-xs font-medium text-muted-foreground">
                    <th className="text-left py-2 px-4">PO #</th>
                    <th className="text-left py-2 px-4">Vendor</th>
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-right py-2 px-4">Amount</th>
                    <th className="text-left py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchasesData.recentOrders.map((order, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-2 px-4 font-medium">{order.poNumber}</td>
                      <td className="py-2 px-4">{order.vendor}</td>
                      <td className="py-2 px-4 text-muted-foreground">{order.date}</td>
                      <td className="py-2 px-4 text-right font-medium">₹{order.amount.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                      <td className="py-2 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}