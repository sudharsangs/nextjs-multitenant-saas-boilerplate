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

interface StockItem {
  id: string;
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
  location: string;
  batchNumber: string;
  expiryDate: string | null;
  status: string;
  lastUpdated: string;
  companyId: string;
}

// Filter options
const locationFilters = [
  "All Locations",
  "Warehouse A",
  "Warehouse B",
  "Storage Room",
  "Shelf 1",
  "Shelf 2",
];

const statusFilters = [
  "All Statuses",
  "In Stock",
  "Low Stock",
  "Out of Stock",
  "Expired",
];

export default function StockPage() {
  const router = useRouter();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortField, setSortField] = useState("lastUpdated");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showImportModal, setShowImportModal] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<StockItem[]>(`/stock`);
      if (response.success && response.data) {
        setStockItems(response.data);
      }
    } catch (err) {
      setError('Failed to load stock items');
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
        { header: 'Product Name', key: 'productName', width: 30 },
        { header: 'Product Code', key: 'productCode', width: 15 },
        { header: 'Category', key: 'categoryName', width: 20 },
        { header: 'Quantity', key: 'quantity', width: 12 },
        { header: 'Location', key: 'location', width: 15 },
        { header: 'Batch Number', key: 'batchNumber', width: 15 },
        { header: 'Expiry Date', key: 'expiryDate', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Last Updated', key: 'lastUpdated', width: 20 },
      ];

      const exportData = stockItems.map(item => ({
        productName: item.product.name,
        productCode: item.product.code,
        categoryName: item.product.category.name,
        quantity: item.quantity,
        location: item.location,
        batchNumber: item.batchNumber,
        expiryDate: item.expiryDate,
        status: item.status,
        lastUpdated: new Date(item.lastUpdated).toLocaleString(),
      }));

      await exportToExcel(exportData, columns, 'stock_export.xlsx');
    } catch (error) {
      console.error('Error exporting stock:', error);
    }
  };

  const handleImport = async (data: Record<string, unknown>[]) => {
    try {
      if (!data || data.length === 0) {
        throw new Error('No valid data found in the import file');
      }
      
      const missingFields: string[] = [];
      data.forEach((item, index) => {
        if (!item.productCode) missingFields.push(`Row ${index + 1}: Missing Product Code`);
        if (!item.quantity) missingFields.push(`Row ${index + 1}: Missing Quantity`);
        if (!item.location) missingFields.push(`Row ${index + 1}: Missing Location`);
      });
      
      if (missingFields.length > 0) {
        throw new Error(`Validation errors:\n${missingFields.join('\n')}`);
      }
      
      const importedStock = data.map(item => ({
        productCode: String(item.productCode),
        quantity: parseInt(String(item.quantity || '0')),
        location: String(item.location),
        batchNumber: String(item.batchNumber || ''),
        expiryDate: item.expiryDate ? new Date(String(item.expiryDate)).toISOString() : null,
        status: String(item.status || 'In Stock'),
      }));

      const response = await api.post('/stock/batch', { stockItems: importedStock });
      
      if (response.success) {
        fetchData();
        return Promise.resolve();
      } else {
        throw new Error(response.error || 'Failed to import stock items');
      }
    } catch (error) {
      console.error('Error importing stock:', error);
      throw error;
    }
  };

  const filteredStockItems = stockItems
    .filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        selectedLocation === "All Locations" || item.location === selectedLocation;

      const matchesStatus =
        selectedStatus === "All Statuses" || item.status === selectedStatus;

      return matchesSearch && matchesLocation && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === "quantity") {
        return sortDirection === "asc" 
          ? a.quantity - b.quantity 
          : b.quantity - a.quantity;
      } else if (sortField === "lastUpdated") {
        return sortDirection === "asc"
          ? new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
          : new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      } else {
        const valueA = String(a[sortField as keyof StockItem]).toLowerCase();
        const valueB = String(b[sortField as keyof StockItem]).toLowerCase();
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
    { header: 'Product Code', key: 'productCode' },
    { header: 'Quantity', key: 'quantity' },
    { header: 'Location', key: 'location' },
    { header: 'Batch Number', key: 'batchNumber' },
    { header: 'Expiry Date', key: 'expiryDate' },
    { header: 'Status', key: 'status' },
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
          <h2 className="text-2xl font-bold mb-2">Error loading stock</h2>
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
          <h1 className="text-2xl font-bold">Stock Management</h1>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search stock items..."
                className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => router.push("/inventory/stock/new")}
              className="flex gap-1"
            >
              <Plus size={16} />
              Add Stock
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
                  setSelectedLocation("All Locations");
                  setSelectedStatus("All Statuses");
                  setSearchQuery("");
                }}
              >
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location Filter */}
            <div>
              <label htmlFor="locationFilter" className="text-sm font-medium block mb-1">
                Location
              </label>
              <select
                id="locationFilter"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locationFilters.map((location) => (
                  <option key={location} value={location}>
                    {location}
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

        {/* Stock Table */}
        <div className="rounded-md border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
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
                      onClick={() => handleSort("location")}
                    >
                      Location
                      {renderSortIcon("location")}
                    </button>
                  </th>
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
                    <button
                      className="flex items-center gap-1"
                      onClick={() => handleSort("lastUpdated")}
                    >
                      Last Updated
                      {renderSortIcon("lastUpdated")}
                    </button>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStockItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-muted-foreground">{item.product.code}</div>
                      </div>
                    </td>
                    <td className="p-4">{item.quantity}</td>
                    <td className="p-4">{item.location}</td>
                    <td className="p-4">{item.batchNumber}</td>
                    <td className="p-4">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                          item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                          item.status === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(item.lastUpdated).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/inventory/stock/${item.id}/edit`)}
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
              Showing {filteredStockItems.length} of {stockItems.length} stock items
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
        title="Import Stock Items"
        description="Upload an Excel file with stock data. The file should have columns for product code, quantity, location, etc."
        templateColumns={importTemplateColumns}
      />
    </div>
  );
}