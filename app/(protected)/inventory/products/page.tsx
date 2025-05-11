"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  ArrowUpDown, 
  Edit, 
  Trash,
  FileDown,
  FileUp,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent
} from "@/components/ui/card";
import { api } from "@/lib/api-client";

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
  const [, setCategories] = useState<{ id: string; name: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [actionProductId, setActionProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const companyId = localStorage.getItem('companyId');
        
        // Fetch products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          api.get<Product[]>(`/products?companyId=${companyId}`),
          api.get<{ id: string; name: string; }[]>(`/categories?companyId=${companyId}`)
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
              <Button variant="outline" size="sm" className="flex gap-1">
                <FileUp size={14} />
                Import
              </Button>
              <Button variant="outline" size="sm" className="flex gap-1">
                <FileDown size={14} />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <div className="rounded-md border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Product Name
                      {renderSortIcon("name")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("code")}
                  >
                    <div className="flex items-center gap-1">
                      SKU/Code
                      {renderSortIcon("code")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center gap-1">
                      Category
                      {renderSortIcon("category")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("totalStock")}
                  >
                    <div className="flex items-center gap-1">
                      Stock
                      {renderSortIcon("totalStock")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide"
                  >
                    Unit
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide"
                  >
                    Reorder Point
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Package size={40} className="mb-2 text-muted-foreground" />
                        <p>No products found</p>
                        <Button
                          variant="link"
                          onClick={() => router.push("/inventory/products/new")}
                          className="mt-2"
                        >
                          Add your first product
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{product.name}</div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {product.code}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {product.category.name}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className={
                          product.totalStock === 0
                            ? "text-destructive font-medium"
                            : product.totalStock < product.reorderPoint
                            ? "text-amber-500 font-medium"
                            : ""
                        }>
                          {product.totalStock.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {product.unit === "PIECE" ? "Piece" : product.unit}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {product.reorderPoint.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${product.status === "Active" ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : ""}
                          ${product.status === "Inactive" ? "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400" : ""}
                          ${product.status === "Low Stock" ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" : ""}
                          ${product.status === "Out of Stock" ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" : ""}
                        `}>
                          {product.status}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right relative">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleActionClick(product.id)}
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                          {actionProductId === product.id && (
                            <div className="absolute right-4 top-10 z-50 rounded-md border border-border bg-card shadow-md w-36">
                              <div className="p-1">
                                <button
                                  className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-accent text-left"
                                  onClick={() => router.push(`/inventory/products/${product.id}`)}
                                >
                                  <Edit size={14} />
                                  Edit
                                </button>
                                <button
                                  className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-accent text-left text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(product.id)}
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
                  ))
                )}
              </tbody>
            </table>
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
    </div>
  );
}