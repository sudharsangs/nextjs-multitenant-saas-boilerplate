"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Filter, 
  ArrowUpDown, 
  FileDown,
  FileUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent
} from "@/components/ui/card";
import { api } from "@/lib/api-client";
import { exportToExcel, ExcelColumn } from "@/lib/excel-utils";
import ImportModal from "@/components/shared/import-modal";

interface Batch {
  id: string;
  batchNumber: string;
  productId: string;
  product: {
    id: string;
    name: string;
    code: string;
    category: {
      id: string;
      name: string;
    };
  };
  quantity: number;
  manufacturingDate: string;
  expiryDate: string | null;
  status: string;
  notes: string;
  companyId: string;
}

// Filter options
const statusFilters = [
  "All Statuses",
  "Active",
  "Expired",
  "Expiring Soon",
  "Depleted",
];

export default function BatchesPage() {
  const router = useRouter();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortField, setSortField] = useState("manufacturingDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showImportModal, setShowImportModal] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Batch[]>(`/batches`);
      if (response.success && response.data) {
        setBatches(response.data);
      }
    } catch (err) {
      setError('Failed to load batches');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { 
    fetchData();
  }, []);

  const handleExport = async () => {
    try {
      const columns: ExcelColumn[] = [
        { header: 'Batch Number', key: 'batchNumber', width: 15 },
        { header: 'Product Name', key: 'productName', width: 30 },
        { header: 'Product Code', key: 'productCode', width: 15 },
        { header: 'Category', key: 'categoryName', width: 20 },
        { header: 'Quantity', key: 'quantity', width: 12 },
        { header: 'Manufacturing Date', key: 'manufacturingDate', width: 15 },
        { header: 'Expiry Date', key: 'expiryDate', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Notes', key: 'notes', width: 30 },
      ];

      const exportData = filteredBatches.map(batch => ({
        batchNumber: batch.batchNumber,
        productName: batch.product.name,
        productCode: batch.product.code,
        categoryName: batch.product.category.name,
        quantity: batch.quantity,
        manufacturingDate: new Date(batch.manufacturingDate).toLocaleDateString(),
        expiryDate: batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'N/A',
        status: batch.status,
        notes: batch.notes,
      }));

      await exportToExcel(exportData, columns, 'batches_export.xlsx');
    } catch (error) {
      console.error('Error exporting batches:', error);
    }
  };

  const handleImport = async (data: Record<string, unknown>[]) => {
    try {
      if (!data || data.length === 0) {
        throw new Error('No valid data found in the import file');
      }
      
      const missingFields: string[] = [];
      data.forEach((item, index) => {
        if (!item.batchNumber) missingFields.push(`Row ${index + 1}: Missing Batch Number`);
        if (!item.productCode) missingFields.push(`Row ${index + 1}: Missing Product Code`);
        if (!item.quantity) missingFields.push(`Row ${index + 1}: Missing Quantity`);
        if (!item.manufacturingDate) missingFields.push(`Row ${index + 1}: Missing Manufacturing Date`);
      });
      
      if (missingFields.length > 0) {
        throw new Error(`Validation errors:\n${missingFields.join('\n')}`);
      }
      
      const importedBatches = data.map(item => ({
        batchNumber: String(item.batchNumber),
        productCode: String(item.productCode),
        quantity: parseInt(String(item.quantity || '0')),
        manufacturingDate: new Date(String(item.manufacturingDate)).toISOString(),
        expiryDate: item.expiryDate ? new Date(String(item.expiryDate)).toISOString() : null,
        status: String(item.status || 'Active'),
        notes: String(item.notes || ''),
      }));

      const response = await api.post('/batches/batch', { batches: importedBatches });
      
      if (response.success) {
        fetchData();
        return Promise.resolve();
      } else {
        throw new Error(response.error || 'Failed to import batches');
      }
    } catch (error) {
      console.error('Error importing batches:', error);
      throw error;
    }
  };

  const filteredBatches = batches
    .filter((batch) => {
      const matchesSearch =
        searchQuery === "" ||
        batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.product.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "All Statuses" || batch.status === selectedStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === "quantity") {
        return sortDirection === "asc" 
          ? a.quantity - b.quantity 
          : b.quantity - a.quantity;
      } else if (sortField === "manufacturingDate" || sortField === "expiryDate") {
        const dateA = new Date(a[sortField as keyof Batch] as string).getTime();
        const dateB = new Date(b[sortField as keyof Batch] as string).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const valueA = String(a[sortField as keyof Batch]).toLowerCase();
        const valueB = String(b[sortField as keyof Batch]).toLowerCase();
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
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

  const importTemplateColumns = [
    { header: 'Batch Number', key: 'batchNumber' },
    { header: 'Product Code', key: 'productCode' },
    { header: 'Quantity', key: 'quantity' },
    { header: 'Manufacturing Date', key: 'manufacturingDate' },
    { header: 'Expiry Date', key: 'expiryDate' },
    { header: 'Status', key: 'status' },
    { header: 'Notes', key: 'notes' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error loading batches</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Batch Management</h1>
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
              Add Batch
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
                  setSelectedStatus("All Statuses");
                  setSearchQuery("");
                }}
              >
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Import/Export Buttons */}
            <div className="flex items-end gap-2 justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex gap-1"
                onClick={() => setShowImportModal(true)}
              >
                <FileUp size={14} />
                Import
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex gap-1"
                onClick={handleExport}
              >
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
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort("batchNumber")}
                    >
                      Batch Number
                      {renderSortIcon("batchNumber")}
                    </button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort("product.name")}
                    >
                      Product
                      {renderSortIcon("product.name")}
                    </button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort("quantity")}
                    >
                      Quantity
                      {renderSortIcon("quantity")}
                    </button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort("manufacturingDate")}
                    >
                      Manufacturing Date
                      {renderSortIcon("manufacturingDate")}
                    </button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort("expiryDate")}
                    >
                      Expiry Date
                      {renderSortIcon("expiryDate")}
                    </button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort("status")}
                    >
                      Status
                      {renderSortIcon("status")}
                    </button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => (
                  <tr key={batch.id} className="border-b">
                    <td className="p-4 font-medium">{batch.batchNumber}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{batch.product.name}</div>
                        <div className="text-sm text-muted-foreground">{batch.product.code}</div>
                      </div>
                    </td>
                    <td className="p-4">{batch.quantity}</td>
                    <td className="p-4">
                      {new Date(batch.manufacturingDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${batch.status === 'Active' ? 'bg-green-100 text-green-800' :
                          batch.status === 'Expired' ? 'bg-red-100 text-red-800' :
                          batch.status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/inventory/batches/${batch.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {filteredBatches.length} of {batches.length} batches
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

      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        title="Import Batches"
        description="Upload an Excel file with batch data. The file should have columns for batch number, product code, quantity, etc."
        templateColumns={importTemplateColumns}
      />
    </div>
  );
}