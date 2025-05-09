import React from "react";
import { PieChart, FileBarChart, DollarSign, ArrowUp } from "lucide-react";

export default function TaxReportsPage() {
  const taxData = {
    totalCollected: 53875.25,
    totalPaid: 42680.30,
    netTaxLiability: 11194.95,
    taxPayable: 11194.95,
    taxesByRate: [
      { rate: 5, collected: 8750.40, paid: 6250.20 },
      { rate: 12, collected: 15625.85, paid: 12540.10 },
      { rate: 18, collected: 29499.00, paid: 23890.00 }
    ],
    monthlyTrends: [
      { month: "Dec", collected: 32450.10, paid: 28740.50 },
      { month: "Jan", collected: 35670.25, paid: 29875.40 },
      { month: "Feb", collected: 38950.60, paid: 32450.75 },
      { month: "Mar", collected: 45280.30, paid: 36720.60 },
      { month: "Apr", collected: 49540.80, paid: 39850.25 },
      { month: "May", collected: 53875.25, paid: 42680.30 }
    ],
    recentTaxTransactions: [
      { invoiceNo: "INV-2025-0005", customer: "ABC Enterprises", date: "May 9, 2025", taxableAmount: 9775.00, taxRate: 5, taxAmount: 488.75 },
      { invoiceNo: "INV-2025-0004", customer: "XYZ Industries", date: "May 8, 2025", taxableAmount: 5190.00, taxRate: 12, taxAmount: 622.80 },
      { invoiceNo: "INV-2025-0003", customer: "Global Manufacturing Ltd", date: "May 7, 2025", taxableAmount: 22265.00, taxRate: 18, taxAmount: 4007.70 },
      { invoiceNo: "INV-2025-0002", customer: "TechSolutions Inc", date: "May 5, 2025", taxableAmount: 8595.00, taxRate: 18, taxAmount: 1547.10 },
      { invoiceNo: "INV-2025-0001", customer: "Acme Corporation", date: "May 3, 2025", taxableAmount: 12287.50, taxRate: 18, taxAmount: 2211.75 }
    ]
  };

  // Function to get tax rate label
  const getTaxRateLabel = (rate: number) => {
    return `${rate}% GST`;
  }

  // Calculate total tax collected
  const totalCollected = taxData.taxesByRate.reduce((acc, curr) => acc + curr.collected, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tax Reports</h1>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Export Report
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow p-6">
        <div className="text-card-foreground">
          <p className="mb-4">View and analyze tax-related reports.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="border rounded-md p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">Total Tax Collected</h3>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold">₹{taxData.totalCollected.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
              <div className="flex items-center text-green-600 mt-1">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+8.8% from last month</span>
              </div>
            </div>
            <div className="border rounded-md p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">Total Tax Paid</h3>
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold">₹{taxData.totalPaid.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
              <div className="flex items-center text-green-600 mt-1">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm">+7.1% from last month</span>
              </div>
            </div>
            <div className="border rounded-md p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">Net Tax Liability</h3>
                <FileBarChart className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-3xl font-bold">₹{taxData.netTaxLiability.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
              <div className="flex items-center text-amber-600 mt-1">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm">Due by May 20, 2025</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Tax by Rate Chart */}
            <div className="border rounded-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">Tax Summary by Rate</h3>
                <PieChart className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-4 mt-6">
                {taxData.taxesByRate.map((tax, index) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-amber-500'];
                  const percentage = Math.round((tax.collected / totalCollected) * 100);
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{getTaxRateLabel(tax.rate)}</span>
                        <span>₹{tax.collected.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mb-1">
                        <div 
                          className={`${colors[index % colors.length]} h-2 rounded-full`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{percentage}% of total tax</span>
                        <span>Net: ₹{(tax.collected - tax.paid).toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Tax Trend */}
            <div className="border rounded-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium">Monthly Tax Trend</h3>
                <FileBarChart className="h-5 w-5 text-blue-500" />
              </div>
              <div className="h-64 flex items-end justify-between space-x-1">
                {taxData.monthlyTrends.map((month, index) => {
                  // Calculate height percentage based on the maximum value
                  const maxCollected = Math.max(...taxData.monthlyTrends.map(m => m.collected));
                  const maxPaid = Math.max(...taxData.monthlyTrends.map(m => m.paid));
                  const maxValue = Math.max(maxCollected, maxPaid);
                  
                  const collectedHeight = (month.collected / maxValue) * 100;
                  const paidHeight = (month.paid / maxValue) * 100;
                  
                  return (
                    <div key={index} className="flex items-end space-x-1 flex-1">
                      <div className="flex flex-col items-center w-1/2">
                        <div 
                          className="w-full bg-green-500 rounded-t"
                          style={{ height: `${collectedHeight}%` }}
                        ></div>
                      </div>
                      <div className="flex flex-col items-center w-1/2">
                        <div 
                          className="w-full bg-blue-400 rounded-t"
                          style={{ height: `${paidHeight}%` }}
                        ></div>
                      </div>
                      <div className="absolute -bottom-6 text-xs text-center w-12">
                        {month.month}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center mt-8 space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-xs">Collected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-1"></div>
                  <span className="text-xs">Paid</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-md p-6">
            <h3 className="text-lg font-medium mb-4">Recent Tax Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-xs font-medium text-muted-foreground">
                    <th className="text-left py-2 px-4">Invoice #</th>
                    <th className="text-left py-2 px-4">Customer</th>
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-right py-2 px-4">Taxable Amount</th>
                    <th className="text-center py-2 px-4">Tax Rate</th>
                    <th className="text-right py-2 px-4">Tax Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {taxData.recentTaxTransactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-2 px-4 font-medium">{transaction.invoiceNo}</td>
                      <td className="py-2 px-4">{transaction.customer}</td>
                      <td className="py-2 px-4 text-muted-foreground">{transaction.date}</td>
                      <td className="py-2 px-4 text-right">₹{transaction.taxableAmount.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
                      <td className="py-2 px-4 text-center">{transaction.taxRate}%</td>
                      <td className="py-2 px-4 text-right font-medium">₹{transaction.taxAmount.toLocaleString('en-IN', {maximumFractionDigits: 2})}</td>
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