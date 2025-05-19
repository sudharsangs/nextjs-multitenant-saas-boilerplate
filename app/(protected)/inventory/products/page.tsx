"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Filter, 
  ArrowUpDown, 
  FileDown,
  FileUp} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent
} from "@/components/ui/card";
import { api } from "@/lib/api-client";
import ProductsTable from "@/components/products/table";
// Import the Excel utilities and import modal
import { exportToExcel, ExcelColumn } from "@/lib/excel-utils";
import ImportModal from "@/components/shared/import-modal";

interface Product {
  id: string;
  name: string;
  code: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  totalStock: number;
  unit: string;
  reorderPoint: number;
  status: string;
  companyId: string;
}

// Filter options
const categoryFilters = [
  "All Categories",
  "Raw Materials",
  "Finished Goods",
  "Packaging Materials",
  "Electrical Components",
  "Mechanical Parts",
];

const statusFilters = [
  "All Statuses",
  "Active",
  "Inactive",
  "Low Stock",
  "Out of Stock",
];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [actionProductId, setActionProductId] = useState<string | null>(null);
  // Add state for import/export modals
  const [showImportModal, setShowImportModal] = useState(false);

   const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get<Product[]>(`/products`),
          api.get<{ id: string; name: string; }[]>(`/categories`)
        ]);

        if (productsResponse.success && productsResponse.data) {
          setProducts(productsResponse.data);
        }

        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => { 
    fetchData();
  }, []);

  const handleDelete = async (productId: string) => {
    try {
      const response = await api.delete(`/products/${productId}`);
      if (response.success) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        throw new Error(response.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setActionProductId(null);
  };

  // Add handleExport function
  const handleExport = async () => {
    try {
      // Define columns for Excel export
      const columns: ExcelColumn[] = [
        { header: 'Product Name', key: 'name', width: 30 },
        { header: 'Product Code', key: 'code', width: 15 },
        { header: 'Category', key: 'categoryName', width: 20 },
        { header: 'Total Stock', key: 'totalStock', width: 12 },
        { header: 'Unit', key: 'unit', width: 10 },
        { header: 'Reorder Point', key: 'reorderPoint', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
      ];

      // Prepare data for export with proper category name
      const exportData = filteredProducts.map(product => ({
        name: product.name,
        code: product.code,
        categoryName: product.category.name,
        totalStock: product.totalStock,
        unit: product.unit,
        reorderPoint: product.reorderPoint,
        status: product.status,
      }));

      // Export to Excel
      await exportToExcel(exportData, columns, 'products_export.xlsx');
    } catch (error) {
      console.error('Error exporting products:', error);
    }
  };

  // Add handleImport function
  const handleImport = async (data: Record<string, unknown>[]) => {
    try {
      // Validate data
      if (!data || data.length === 0) {
        throw new Error('No valid data found in the import file');
      }
      
      // Check required fields
      const missingFields: string[] = [];
      data.forEach((item, index) => {
        if (!item.name) missingFields.push(`Row ${index + 1}: Missing Product Name`);
        if (!item.code) missingFields.push(`Row ${index + 1}: Missing Product Code`);
      });
      
      if (missingFields.length > 0) {
        throw new Error(`Validation errors:\n${missingFields.join('\n')}`);
      }
      
      // Process the imported data
      const importedProducts = data.map(item => {
        // Find category ID by name
        const categoryName = String(item.categoryName || '');
        const category = categories.find(cat => cat.name === categoryName);
        
        // Use default category if not found
        const defaultCategoryId = categories.length > 0 ? categories[0].id : '';
        
        return {
          name: String(item.name || ''),
          code: String(item.code || ''),
          categoryId: category?.id || defaultCategoryId,
          totalStock: parseInt(String(item.totalStock || '0')),
          unit: String(item.unit || 'PIECE'),
          reorderPoint: parseInt(String(item.reorderPoint || '0')),
          status: String(item.status || 'Active'),
          // Additional fields as needed
        };
      });

      // Create a batch import request
      const response = await api.post('/products/batch', { products: importedProducts });
      
      if (response.success) {
        // Refresh products list
        fetchData();
        return Promise.resolve();
      } else {
        throw new Error(response.error || 'Failed to import products');
      }
    } catch (error) {
      console.error('Error importing products:', error);
      throw error;
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.code.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "All Categories" || product.category.name === selectedCategory;

      // Status filter
      const matchesStatus =
        selectedStatus === "All Statuses" || product.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "totalStock") {
        return sortDirection === "asc" 
          ? a.totalStock - b.totalStock 
          : b.totalStock - a.totalStock;
      } else {
        // Sort alphabetically for other fields (name, code, etc.)
        const valueA = (a[sortField as keyof Product] as string).toLowerCase();
        const valueB = (b[sortField as keyof Product] as string).toLowerCase();
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

  const handleActionClick = (productId: string) => {
    setActionProductId(actionProductId === productId ? null : productId);
  };

  // Define template columns for import
  const importTemplateColumns = [
    { header: 'Product Name', key: 'name' },
    { header: 'Product Code', key: 'code' },
    { header: 'Category', key: 'categoryName' },
    { header: 'Total Stock', key: 'totalStock' },
    { header: 'Unit', key: 'unit' },
    { header: 'Reorder Point', key: 'reorderPoint' },
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
          <h2 className="text-2xl font-bold mb-2">Error loading products</h2>
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
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => router.push("/inventory/products/new")}
              className="flex gap-1"
            >
              <Plus size={16} />
              Add Product
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
                  setSelectedCategory("All Categories");
                  setSelectedStatus("All Statuses");
                  setSearchQuery("");
                }}
              >
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label htmlFor="categoryFilter" className="text-sm font-medium block mb-1">
                Category
              </label>
              <select
                id="categoryFilter"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categoryFilters.map((category) => (
                  <option key={category} value={category}>
                    {category}
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

        {/* Products Table */}
        <div className="rounded-md border bg-card">
          <div className="overflow-x-auto">
            <ProductsTable 
            products={products} 
            handleActionClick={handleActionClick}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
            handleDelete={handleDelete}
            actionProductId={actionProductId}
            />
          </div>
          
          {/* Simple Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
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
        title="Import Products"
        description="Upload an Excel file with product data. The file should have columns for name, code, category, stock, etc."
        templateColumns={importTemplateColumns}
      />
    </div>
  );
}