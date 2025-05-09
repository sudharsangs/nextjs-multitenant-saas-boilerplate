import React from "react";
import { TrendingUp, Users, ArrowUp, ArrowDown } from "lucide-react";
import SalesChart from "../../../../components/charts/SalesChart";

export default function SalesReportsPage() {
  const salesData = {
    totalSales: 258450.00,
    orders: 78,
    avgOrderValue: 3313.46,
    monthlyTrend: [
      { month: "Dec", value: 162500 },
      { month: "Jan", value: 178900 },
      { month: "Feb", value: 201350 },
      { month: "Mar", value: 225780 },
      { month: "Apr", value: 242100 },
      { month: "May", value: 258450 }
    ],
    topProducts: [
      { name: "Circuit Board X1", revenue: 84060.00, growth: 12.3, units: 240 },
      { name: "Plastic Housing Type B", revenue: 36225.00, growth: 8.7, units: 300 },
      { name: "Aluminum Sheet (2mm)", revenue: 28080.00, growth: -2.1, units: 160 },
      { name: "LED Bulbs 5W", revenue: 11250.00, growth: 5.8, units: 250 },
      { name: "Steel Bolts (10mm)", revenue: 6250.00, growth: 1.2, units: 250 }
    ],
    topCustomers: [
      { name: "Acme Corporation", revenue: 62500.00, orders: 15 },
      { name: "TechSolutions Inc", revenue: 52503.00, orders: 18 },
      { name: "Global Manufacturing Ltd", revenue: 44701.50, orders: 12 },
      { name: "XYZ Industries", revenue: 31501.50, orders: 8 },
      { name: "ABC Enterprises", revenue: 29400.00, orders: 11 }
    ],
    recentTransactions: [
      { invoiceNo: "INV-2025-0005", customer: "ABC Enterprises", date: "May 9, 2025", amount: 9800.00, status: "PAID" },
      { invoiceNo: "INV-2025-0004", customer: "XYZ Industries", date: "May 8, 2025", amount: 5250.25, status: "OVERDUE" },
      { invoiceNo: "INV-2025-0003", customer: "Global Manufacturing Ltd", date: "May 7, 2025", amount: 22350.75, status: "PENDING" },
      { invoiceNo: "INV-2025-0002", customer: "TechSolutions Inc", date: "May 5, 2025", amount: 8750.50, status: "PENDING" },
      { invoiceNo: "INV-2025-0001", customer: "Acme Corporation", date: "May 3, 2025", amount: 12500.00, status: "PAID" }
    ]
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "PAID": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-blue-100 text-blue-800";
      case "OVERDUE": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sales Reports</h1>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Export Report
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow p-6">
        <div className="text-card-foreground">
          <p className="mb-4">View and analyze sales metrics and reports.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-medium mb-2">Total Sales</h3>
              <p className="text-3xl font-bold">₹{salesData.totalSales.toLocaleString('en-IN')}</p>
              <div className="flex items-center text-green-600 mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+6.8% from last month</span>
              </div>
            </div>
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-medium mb-2">Orders</h3>
              <p className="text-3xl font-bold">{salesData.orders}</p>
              <div className="flex items-center text-green-600 mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+12 from last month</span>
              </div>
            </div>
            <div className="border rounded-md p-6">
              <h3 className="text-lg font-medium mb-2">Avg. Order Value</h3>
              <p className="text-3xl font-bold">₹{salesData.avgOrderValue.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
              <div className="flex items-center text-amber-600 mt-1">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span className="text-sm">-1.2% from last month</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Sales Trend Chart */}
            <div className="border rounded-md p-6">
                <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-medium">Monthly Sales Trend</h3>
                  <p className="text-sm text-muted-foreground">Total revenue: ₹{salesData.monthlyTrend.reduce((sum, month) => sum + month.value, 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                  <span className="text-green-600 text-sm font-medium">+{((salesData.monthlyTrend[5].value - salesData.monthlyTrend[0].value) / salesData.monthlyTrend[0].value * 100).toFixed(1)}% growth</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Dec - May</p>
                </div>
                </div>
              <div className="h-64">
                <SalesChart data={salesData.monthlyTrend} />
              </div>
            </div>

            {/* Top Customers */}
            <div className="border rounded-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">Top Customers</h3>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-4">
                {salesData.topCustomers.map((customer, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{customer.revenue.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-muted-foreground">{((customer.revenue / salesData.totalSales) * 100).toFixed(1)}% of sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border rounded-md p-6 mb-8">
            <h3 className="text-lg font-medium mb-4">Top Selling Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-xs font-medium text-muted-foreground">
                    <th className="text-left py-2 px-4">Product</th>
                    <th className="text-right py-2 px-4">Units Sold</th>
                    <th className="text-right py-2 px-4">Revenue</th>
                    <th className="text-right py-2 px-4">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.topProducts.map((product, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-2 px-4 font-medium">{product.name}</td>
                      <td className="py-2 px-4 text-right">{product.units}</td>
                      <td className="py-2 px-4 text-right">₹{product.revenue.toLocaleString('en-IN')}</td>
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
            <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-xs font-medium text-muted-foreground">
                    <th className="text-left py-2 px-4">Invoice #</th>
                    <th className="text-left py-2 px-4">Customer</th>
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-right py-2 px-4">Amount</th>
                    <th className="text-left py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.recentTransactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-2 px-4 font-medium">{transaction.invoiceNo}</td>
                      <td className="py-2 px-4">{transaction.customer}</td>
                      <td className="py-2 px-4 text-muted-foreground">{transaction.date}</td>
                      <td className="py-2 px-4 text-right font-medium">₹{transaction.amount.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                      <td className="py-2 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
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