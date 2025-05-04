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
  Trash,
  FileDown,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent
} from "@/components/ui/card";

// Mock batches data
const mockBatches = [
  { 
    id: "batch1", 
    batchNumber: "STL-B10-123456", 
    productName: "Steel Bolts (10mm)",
    productCode: "STL-B10",
    manufacturingDate: "2025-04-15",
    expiryDate: "2026-04-15",
    quantity: 1000,
    availableQuantity: 850,
    status: "ACTIVE",
  },
  { 
    id: "batch2", 
    batchNumber: "ALU-S2-234567", 
    productName: "Aluminum Sheet (2mm)",
    productCode: "ALU-S2",
    manufacturingDate: "2025-04-10",
    expiryDate: "2025-07-10",
    quantity: 150,
    availableQuantity: 150,
    status: "ACTIVE",
  },
  { 
    id: "batch3", 
    batchNumber: "PLT-HB-345678", 
    productName: "Plastic Housing Type B",
    productCode: "PLT-HB",
    manufacturingDate: "2025-04-01",
    expiryDate: "2025-10-01",
    quantity: 500,
    availableQuantity: 320,
    status: "ACTIVE",
  },
  { 
    id: "batch4", 
    batchNumber: "STL-B10-456789", 
    productName: "Steel Bolts (10mm)",
    productCode: "STL-B10",
    manufacturingDate: "2025-03-20",
    expiryDate: "2026-03-20",
    quantity: 1500,
    availableQuantity: 1500,
    status: "ACTIVE",
  },
  { 
    id: "batch5", 
    batchNumber: "LED-B5W-567890", 
    productName: "LED Bulbs 5W",
    productCode: "LED-B5W",
    manufacturingDate: "2025-02-10",
    expiryDate: "2026-02-10",
    quantity: 750,
    availableQuantity: 450,
    status: "ACTIVE",
  },
  { 
    id: "batch6", 
    batchNumber: "CBX-001-678901", 
    productName: "Circuit Board X1",
    productCode: "CBX-001",
    manufacturingDate: "2025-01-15",
    expiryDate: "2025-06-15",
    quantity: 200,
    availableQuantity: 75,
    status: "ACTIVE",
  },
  { 
    id: "batch7", 
    batchNumber: "TP-100-789012", 
    productName: "Thermal Paste",
    productCode: "TP-100",
    manufacturingDate: "2024-12-10",
    expiryDate: "2025-06-10",
    quantity: 100,
    availableQuantity: 45,
    status: "ACTIVE",
  },
  { 
    id: "batch8", 
    batchNumber: "SSS-001-890123", 
    productName: "Stainless Steel Screws",
    productCode: "SSS-001",
    manufacturingDate: "2025-03-01",
    expiryDate: "2027-03-01",
    quantity: 5000,
    availableQuantity: 5000,
    status: "ACTIVE",
  },
  { 
    id: "batch9", 
    batchNumber: "CBX-002-901234", 
    productName: "Circuit Board X2",
    productCode: "CBX-002",
    manufacturingDate: "2024-11-05",
    expiryDate: "2025-05-05",
    quantity: 50,
    availableQuantity: 0,
    status: "RECALLED",
  },
];

// Filter options
const productFilters = [
  "All Products",
  "Steel Bolts (10mm)",
  "Aluminum Sheet (2mm)",
  "Plastic Housing Type B",
  "Circuit Board X1",
  "LED Bulbs 5W",
  "Stainless Steel Screws",
  "Thermal Paste",
  "Circuit Board X2",
];

const statusFilters = [
  "All Statuses",
  "ACTIVE",
  "EXPIRED",
  "RECALLED",
];

export default function BatchesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("All Products");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortField, setSortField] = useState("batchNumber");
  const [sortDirection, setSortDirection] = useState("asc");
  const [actionBatchId, setActionBatchId] = useState<string | null>(null);

  // Calculate days until expiry
  const calculateDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter and sort batches
  const filteredBatches = mockBatches
    .filter((batch) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.productCode.toLowerCase().includes(searchQuery.toLowerCase());

      // Product filter
      const matchesProduct =
        selectedProduct === "All Products" || batch.productName === selectedProduct;

      // Status filter
      const matchesStatus =
        selectedStatus === "All Statuses" || batch.status === selectedStatus;

      return matchesSearch && matchesProduct && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "quantity" || sortField === "availableQuantity") {
        return sortDirection === "asc" 
          ? a[sortField] - b[sortField] 
          : b[sortField] - a[sortField];
      } else if (sortField === "manufacturingDate" || sortField === "expiryDate") {
        const dateA = new Date(a[sortField]).getTime();
        const dateB = new Date(b[sortField]).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        // Sort alphabetically for other fields
        const valueA = String(a[sortField]).toLowerCase();
        const valueB = String(b[sortField]).toLowerCase();
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and reset direction to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown size={14} />;
    return sortDirection === "asc" ? (
      <ArrowUpDown size={14} className="text-primary" />
    ) : (
      <ArrowUpDown size={14} className="text-primary rotate-180" />
    );
  };

  const handleActionClick = (batchId: string) => {
    setActionBatchId(actionBatchId === batchId ? null : batchId);
  };

  const handleDelete = (batchId: string) => {
    // Mock delete functionality
    console.log(`Delete batch with ID: ${batchId}`);
    setActionBatchId(null);
    // Actual implementation would send a DELETE request to the API
  };

  return (
    <div className="flex-1">
      <main>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Product Batches</h1>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search batches..."
                className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => router.push("/inventory/batches/new")}
              className="flex gap-1"
            >
              <Plus size={16} />
              Create Batch
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter size={16} />
                Filters
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedProduct("All Products");
                  setSelectedStatus("All Statuses");
                  setSearchQuery("");
                }}
              >
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Product Filter */}
            <div>
              <label htmlFor="productFilter" className="text-sm font-medium block mb-1">
                Product
              </label>
              <select
                id="productFilter"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {productFilters.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
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

            {/* Export Button */}
            <div className="flex items-end gap-2 justify-end">
              <Button variant="outline" size="sm" className="flex gap-1">
                <FileDown size={14} />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Batches Table */}
        <div className="rounded-md border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("batchNumber")}
                  >
                    <div className="flex items-center gap-1">
                      Batch Number
                      {renderSortIcon("batchNumber")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("productName")}
                  >
                    <div className="flex items-center gap-1">
                      Product
                      {renderSortIcon("productName")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("manufacturingDate")}
                  >
                    <div className="flex items-center gap-1">
                      Mfg. Date
                      {renderSortIcon("manufacturingDate")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("expiryDate")}
                  >
                    <div className="flex items-center gap-1">
                      Expiry
                      {renderSortIcon("expiryDate")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("quantity")}
                  >
                    <div className="flex items-center gap-1">
                      Initial Qty
                      {renderSortIcon("quantity")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("availableQuantity")}
                  >
                    <div className="flex items-center gap-1">
                      Available
                      {renderSortIcon("availableQuantity")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {renderSortIcon("status")}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <ClipboardList size={40} className="mb-2 text-muted-foreground" />
                        <p>No batches found</p>
                        <Button
                          variant="link"
                          onClick={() => router.push("/inventory/batches/new")}
                          className="mt-2"
                        >
                          Create your first batch
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBatches.map((batch) => {
                    // Calculate days until expiry to determine if close to expiry or expired
                    const daysUntilExpiry = calculateDaysUntilExpiry(batch.expiryDate);
                    const isExpired = daysUntilExpiry <= 0;
                    const isCloseToExpiry = daysUntilExpiry > 0 && daysUntilExpiry <= 30;

                    return (
                      <tr key={batch.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{batch.batchNumber}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{batch.productName}</div>
                            <div className="text-xs text-muted-foreground">{batch.productCode}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(batch.manufacturingDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className={`
                            ${isExpired ? "text-destructive font-medium" : ""}
                            ${isCloseToExpiry ? "text-amber-500 font-medium" : ""}
                          `}>
                            {new Date(batch.expiryDate).toLocaleDateString()}
                            {isExpired && (
                              <div className="text-xs">Expired</div>
                            )}
                            {isCloseToExpiry && !isExpired && (
                              <div className="text-xs">Expires soon</div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {batch.quantity.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className={
                            batch.availableQuantity === 0
                              ? "text-destructive font-medium"
                              : batch.availableQuantity < batch.quantity * 0.2
                              ? "text-amber-500 font-medium"
                              : ""
                          }>
                            {batch.availableQuantity.toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                            ${batch.status === "ACTIVE" ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : ""}
                            ${batch.status === "EXPIRED" ? "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400" : ""}
                            ${batch.status === "RECALLED" ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" : ""}
                          `}>
                            {batch.status}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right relative">
                          <div className="flex justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleActionClick(batch.id)}
                            >
                              <MoreHorizontal size={16} />
                            </Button>
                            {actionBatchId === batch.id && (
                              <div className="absolute right-4 top-10 z-50 rounded-md border border-border bg-card shadow-md w-36">
                                <div className="p-1">
                                  <button
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-accent text-left"
                                    onClick={() => router.push(`/inventory/batches/${batch.id}`)}
                                  >
                                    <Eye size={14} />
                                    View Details
                                  </button>
                                  <button
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-accent text-left text-destructive hover:text-destructive"
                                    onClick={() => handleDelete(batch.id)}
                                  >
                                    <Trash size={14} />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Simple Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {filteredBatches.length} of {mockBatches.length} batches
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}