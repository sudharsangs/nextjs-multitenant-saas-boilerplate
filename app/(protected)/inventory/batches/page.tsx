"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  AlertCircle,
  FileDown,
  CheckCircle,
  TimerOff,
  ClipboardList,
  PackageOpen,
  Calendar
} from "lucide-react";
import Link from "next/link";

interface Batch {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  productCode: string;
  manufacturingDate: string;
  expiryDate: string | null;
  quantity: number;
  status: 'ACTIVE' | 'EXPIRED' | 'RECALLED';
  locationName?: string;
}

export default function BatchesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Dummy data for batches
  const [batches, setBatches] = useState<Batch[]>([
    {
      id: "1",
      batchNumber: "B-2025-0401",
      productId: "1",
      productName: "Steel Bolts (10mm)",
      productCode: "SB-10MM",
      manufacturingDate: "2025-04-01T00:00:00Z",
      expiryDate: null, // No expiry for metal parts
      quantity: 5000,
      status: "ACTIVE",
      locationName: "Main Warehouse"
    },
    {
      id: "2",
      batchNumber: "B-2025-0402",
      productId: "2",
      productName: "Aluminum Sheet (2mm)",
      productCode: "AL-S2MM",
      manufacturingDate: "2025-04-02T00:00:00Z",
      expiryDate: null,
      quantity: 150,
      status: "ACTIVE",
      locationName: "Main Warehouse"
    },
    {
      id: "3",
      batchNumber: "B-2025-0315",
      productId: "3",
      productName: "Plastic Housing Type B",
      productCode: "PH-TYPB",
      manufacturingDate: "2025-03-15T00:00:00Z",
      expiryDate: "2027-03-15T00:00:00Z", // 2 years shelf life
      quantity: 350,
      status: "ACTIVE",
      locationName: "Factory Floor"
    },
    {
      id: "4",
      batchNumber: "B-2024-1201",
      productId: "4",
      productName: "Rubber Gasket Type A",
      productCode: "RG-TYPA",
      manufacturingDate: "2024-12-01T00:00:00Z",
      expiryDate: "2025-12-01T00:00:00Z", // 1 year shelf life
      quantity: 1200,
      status: "ACTIVE",
      locationName: "Main Warehouse"
    },
    {
      id: "5",
      batchNumber: "B-2024-0930",
      productId: "5",
      productName: "Adhesive Type XL",
      productCode: "ADH-XL",
      manufacturingDate: "2024-09-30T00:00:00Z",
      expiryDate: "2025-03-30T00:00:00Z", // 6 months shelf life
      quantity: 48,
      status: "EXPIRED",
      locationName: "Main Warehouse"
    },
    {
      id: "6",
      batchNumber: "B-2025-0201",
      productId: "6",
      productName: "Circuit Board v2",
      productCode: "CB-V2",
      manufacturingDate: "2025-02-01T00:00:00Z",
      expiryDate: "2027-02-01T00:00:00Z",
      quantity: 0, // All used
      status: "ACTIVE",
      locationName: "Factory Floor"
    },
    {
      id: "7",
      batchNumber: "B-2025-0320",
      productId: "7",
      productName: "Paint - White",
      productCode: "PT-WHT",
      manufacturingDate: "2025-03-20T00:00:00Z",
      expiryDate: "2026-03-20T00:00:00Z",
      quantity: 24,
      status: "RECALLED",
      locationName: "Main Warehouse"
    },
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  // Filter batches based on search term and status
  const filteredBatches = batches.filter((batch) => {
    const matchesSearch = 
      batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      batch.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      batch.productCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus ? batch.status === selectedStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  // Get batch counts by status
  const activeBatches = batches.filter(batch => batch.status === "ACTIVE").length;
  const expiredBatches = batches.filter(batch => batch.status === "EXPIRED").length;
  const recalledBatches = batches.filter(batch => batch.status === "RECALLED").length;

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDateString: string | null) => {
    if (!expiryDateString) return Infinity;
    
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    
    // Set both dates to start of day for accurate calculation
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Check if batch is expiring soon (within 30 days)
  const isExpiringSoon = (expiryDateString: string | null) => {
    if (!expiryDateString) return false;
    
    const daysUntilExpiry = getDaysUntilExpiry(expiryDateString);
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Batches</h2>
        <div className="flex items-center gap-2">
          <Link 
            href="/inventory/batches/new" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
          >
            <Plus size={16} className="mr-2" />
            Add Batch
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search batches..."
            className="w-full rounded-md border border-input bg-background pl-8 p-2 text-sm shadow-sm outline-none focus:border-primary"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
            value={selectedStatus}
            onChange={handleStatusFilter}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="RECALLED">Recalled</option>
          </select>
          <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm">
            <FileDown size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Active Batches</p>
            <CheckCircle size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-500">{activeBatches}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Expired Batches</p>
            <TimerOff size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-500">{expiredBatches}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Recalled Batches</p>
            <ClipboardList size={18} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-500">{recalledBatches}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading batches...</p>
          </div>
        </div>
      ) : batches.length === 0 ? (
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border flex flex-col items-center justify-center text-center h-64">
          <AlertCircle size={40} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No batches found</h3>
          <p className="text-muted-foreground mb-4 max-w-md">Start by adding product batches for better inventory tracking.</p>
          <Link 
            href="/inventory/batches/new"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
          >
            <Plus size={16} className="mr-2" />
            Add Your First Batch
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Batch Number
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Product
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Status
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Quantity
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Manufacturing Date
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Expiry Date
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Location
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => {
                  const daysUntilExpiry = batch.expiryDate ? getDaysUntilExpiry(batch.expiryDate) : null;
                  const expiringSoon = isExpiringSoon(batch.expiryDate);
                  
                  return (
                    <tr key={batch.id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-4 text-sm font-medium">
                        <Link 
                          href={`/inventory/batches/${batch.id}`}
                          className="hover:underline"
                        >
                          {batch.batchNumber}
                        </Link>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="flex items-center">
                          <Link 
                            href={`/inventory/products/${batch.productId}`} 
                            className="font-medium hover:underline flex items-center"
                          >
                            <PackageOpen size={16} className="mr-1.5" />
                            {batch.productName}
                          </Link>
                        </div>
                        <span className="text-xs text-muted-foreground">{batch.productCode}</span>
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${batch.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                          ${batch.status === 'EXPIRED' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                          ${batch.status === 'RECALLED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                        `}>
                          {batch.status === 'ACTIVE' && <CheckCircle size={12} className="mr-1" />}
                          {batch.status === 'EXPIRED' && <TimerOff size={12} className="mr-1" />}
                          {batch.status === 'RECALLED' && <ClipboardList size={12} className="mr-1" />}
                          {batch.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm">
                        {batch.quantity}
                      </td>
                      <td className="p-4 text-sm">
                        {formatDate(batch.manufacturingDate)}
                      </td>
                      <td className="p-4 text-sm">
                        {batch.expiryDate ? (
                          <span className={`flex items-center
                            ${daysUntilExpiry && daysUntilExpiry <= 0 ? 'text-red-500' : ''}
                            ${expiringSoon ? 'text-amber-500' : ''}
                          `}>
                            <Calendar size={14} className="mr-1.5" />
                            {formatDate(batch.expiryDate)}
                            {daysUntilExpiry !== null && daysUntilExpiry > 0 && expiringSoon && (
                              <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                                {daysUntilExpiry} days left
                              </span>
                            )}
                            {daysUntilExpiry !== null && daysUntilExpiry <= 0 && (
                              <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                                Expired
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {batch.locationName || '-'}
                      </td>
                      <td className="p-4 text-sm text-right">
                        <div className="flex justify-end">
                          <Link 
                            href={`/inventory/batches/${batch.id}/edit`}
                            className="text-muted-foreground hover:text-foreground mr-4"
                          >
                            Edit
                          </Link>
                          <button className="text-muted-foreground hover:text-foreground">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <strong>{filteredBatches.length}</strong> of{" "}
              <strong>{batches.length}</strong> batches
            </p>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm" disabled>
                Previous
              </button>
              <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}