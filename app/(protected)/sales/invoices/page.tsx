"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  ArrowUpDown, 
  Eye, 
  FileDown,
  Printer,
  Receipt,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription
} from "@/components/ui/card";

// Mock invoices data
const mockInvoices = [
  { 
    id: "inv1", 
    invoiceNumber: "INV-2025-0001", 
    customer: "Acme Corporation",
    date: "2025-05-01",
    dueDate: "2025-05-31",
    amount: 12500.00,
    status: "PAID",
  },
  { 
    id: "inv2", 
    invoiceNumber: "INV-2025-0002", 
    customer: "TechSolutions Inc",
    date: "2025-05-02",
    dueDate: "2025-06-01",
    amount: 8750.50,
    status: "PENDING",
  },
  { 
    id: "inv3", 
    invoiceNumber: "INV-2025-0003", 
    customer: "Global Manufacturing Ltd",
    date: "2025-05-03",
    dueDate: "2025-05-17",
    amount: 22350.75,
    status: "PENDING",
  },
  { 
    id: "inv4", 
    invoiceNumber: "INV-2025-0004", 
    customer: "XYZ Industries",
    date: "2025-04-20",
    dueDate: "2025-05-05",
    amount: 5250.25,
    status: "OVERDUE",
  },
  { 
    id: "inv5", 
    invoiceNumber: "INV-2025-0005", 
    customer: "ABC Enterprises",
    date: "2025-04-15",
    dueDate: "2025-04-30",
    amount: 9800.00,
    status: "PAID",
  },
];

export default function InvoicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortField, setSortField] = useState<string | null>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Status filters
  const statusFilters = ["ALL", "PENDING", "PAID", "OVERDUE", "CANCELLED"];

  // Filter and sort invoices based on search query and filters
  const filteredInvoices = mockInvoices
    .filter((invoice) => {
      // Filter by search query
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customer.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = selectedStatus === "ALL" || invoice.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      // Handle different field types
      let comparison = 0;
      if (sortField === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortField === "date" || sortField === "dueDate") {
        comparison = new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
      } else {
        comparison = a[sortField].localeCompare(b[sortField]);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const handleSort = (field: string) => {
    // If clicking the same field, toggle direction
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, set as default desc
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="opacity-50" />;
    return sortDirection === "asc" ? 
      <ArrowUpDown size={14} className="text-primary" /> : 
      <ArrowUpDown size={14} className="text-primary" />;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "PAID": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-blue-100 text-blue-800";
      case "OVERDUE": return "bg-red-100 text-red-800";
      case "CANCELLED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Button
          className="flex items-center gap-1"
          onClick={() => router.push("/sales/invoices/new")}
        >
          <Plus size={16} />
          Create Invoice
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter size={16} />
              Filters
            </CardTitle>
          </div>
          <CardDescription>Filter invoices by status, customer, or date</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search invoices..."
              className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label htmlFor="statusFilter" className="text-sm font-medium block mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusFilters.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Export Buttons */}
          <div className="flex items-end gap-2 justify-end">
            <Button variant="outline" size="sm" className="flex gap-1">
              <FileDown size={14} />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      {filteredInvoices.length > 0 ? (
        <div className="rounded-md border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("invoiceNumber")}
                  >
                    <div className="flex items-center gap-1">
                      Invoice #
                      {renderSortIcon("invoiceNumber")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("customer")}
                  >
                    <div className="flex items-center gap-1">
                      Customer
                      {renderSortIcon("customer")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {renderSortIcon("date")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("dueDate")}
                  >
                    <div className="flex items-center gap-1">
                      Due Date
                      {renderSortIcon("dueDate")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center gap-1">
                      Amount
                      {renderSortIcon("amount")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide"
                  >
                    Status
                  </th>
                  <th 
                    className="text-right py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <span className="font-medium">{invoice.invoiceNumber}</span>
                    </td>
                    <td className="py-3 px-4">{invoice.customer}</td>
                    <td className="py-3 px-4">{formatDate(invoice.date)}</td>
                    <td className="py-3 px-4">{formatDate(invoice.dueDate)}</td>
                    <td className="py-3 px-4">₹{invoice.amount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => router.push(`/sales/invoices/${invoice.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => window.open(`/api/v1/invoices/${invoice.id}/pdf`, '_blank')}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow p-6">
          <div className="text-card-foreground">
            <p className="mb-4">Manage your sales invoices here.</p>
            <div className="border rounded-md p-8 text-center">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No invoices found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first invoice.</p>
              <Button 
                onClick={() => router.push("/sales/invoices/new")}
                className="flex items-center mx-auto gap-1"
              >
                <Plus size={16} />
                Create Invoice
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}