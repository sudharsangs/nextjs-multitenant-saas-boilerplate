"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  AlertCircle,
  Package,
  FileDown,
  FolderTree,
  Clipboard,
  Tag
} from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  categoryId: string;
  categoryName: string;
  unit: 'PIECE' | 'KG' | 'LITER' | 'METER' | 'SQUARE_METER' | 'CUBIC_METER';
  hsnCode?: string;
  stockLevel: number;
  reorderPoint?: number;
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Dummy data for products
  const [products, setProducts] = useState<Product[]>([
    { 
      id: "1", 
      name: "Steel Bolts (10mm)", 
      code: "SB-10MM",
      description: "10mm diameter steel bolts",
      categoryId: "4",
      categoryName: "Steel Bolts",
      unit: "PIECE",
      hsnCode: "7318",
      stockLevel: 5200,
      reorderPoint: 1000
    },
    { 
      id: "2", 
      name: "Aluminum Sheet (2mm)", 
      code: "AL-S2MM",
      description: "2mm thick aluminum sheets",
      categoryId: "5",
      categoryName: "Aluminum Sheets",
      unit: "PIECE",
      hsnCode: "7606",
      stockLevel: 157,
      reorderPoint: 50
    },
    { 
      id: "3", 
      name: "Plastic Housing Type B", 
      code: "PH-TYPB",
      description: "Plastic housing for electronic components",
      categoryId: "3",
      categoryName: "Casings",
      unit: "PIECE",
      stockLevel: 352,
      reorderPoint: 100
    },
    { 
      id: "4", 
      name: "Copper Wire (1.5mm)", 
      code: "CW-1.5MM",
      description: "1.5mm diameter copper wire",
      categoryId: "1",
      categoryName: "Raw Materials",
      unit: "METER",
      hsnCode: "7408",
      stockLevel: 1500,
      reorderPoint: 300
    },
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.hsnCode && product.hsnCode.includes(searchTerm))
  );

  // Check if stock level is low (below reorder point)
  const isLowStock = (product: Product) => {
    if (product.reorderPoint && product.stockLevel < product.reorderPoint) {
      return true;
    }
    return false;
  };

  // Format unit for display
  const formatUnit = (unit: string) => {
    return unit.replace("_", " ").toLowerCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center gap-2">
          <Link 
            href="/inventory/products/bom" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background px-4 py-2 shadow-sm hover:bg-accent"
          >
            <Clipboard size={16} className="mr-2" />
            BOM
          </Link>
          <Link 
            href="/inventory/products/new" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
          >
            <Plus size={16} className="mr-2" />
            Add Product
          </Link>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search products..."
            className="w-full rounded-md border border-input bg-background pl-8 p-2 text-sm shadow-sm outline-none focus:border-primary"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm">
            <FileDown size={16} className="mr-2" />
            Export
          </button>
          <Link href="/inventory/categories" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm">
            <FolderTree size={16} className="mr-2" />
            Categories
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <p className="text-sm font-medium text-muted-foreground">Total Products</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
          <p className="text-2xl font-bold">{products.filter(p => isLowStock(p)).length}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <p className="text-sm font-medium text-muted-foreground">Categories</p>
          <p className="text-2xl font-bold">5</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <p className="text-sm font-medium text-muted-foreground">Total Stock Value</p>
          <p className="text-2xl font-bold">₹875,400</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border flex flex-col items-center justify-center text-center h-64">
          <AlertCircle size={40} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4 max-w-md">Start by adding products to your inventory.</p>
          <div className="flex gap-3">
            <Link 
              href="/inventory/products/new"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </Link>
            <Link 
              href="/inventory/categories/new"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background px-4 py-2 shadow-sm hover:bg-accent"
            >
              <FolderTree size={16} className="mr-2" />
              Add Category
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
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
                      Code
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Category
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Stock Level
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Unit
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      HSN Code
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-border hover:bg-muted/50">
                    <td className="p-4 text-sm">
                      <div className="flex items-center">
                        <Package size={16} className="mr-2 text-muted-foreground" />
                        <Link 
                          href={`/inventory/products/${product.id}`} 
                          className="font-medium text-foreground hover:underline"
                        >
                          {product.name}
                        </Link>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                    </td>
                    <td className="p-4 text-sm">{product.code}</td>
                    <td className="p-4 text-sm">
                      <Link 
                        href={`/inventory/categories/${product.categoryId}`}
                        className="text-muted-foreground hover:text-foreground hover:underline flex items-center"
                      >
                        <FolderTree size={14} className="mr-1" />
                        {product.categoryName}
                      </Link>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center">
                        <span className={`font-medium ${
                          isLowStock(product)
                            ? "text-red-500 dark:text-red-400"
                            : ""
                        }`}>
                          {product.stockLevel} {formatUnit(product.unit)}
                        </span>
                        {isLowStock(product) && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded">
                            Low Stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm capitalize">{formatUnit(product.unit)}</td>
                    <td className="p-4 text-sm">
                      {product.hsnCode ? (
                        <Link 
                          href={`/settings/tax-rates?hsnCode=${product.hsnCode}`}
                          className="flex items-center text-muted-foreground hover:text-foreground"
                        >
                          <Tag size={14} className="mr-1" />
                          {product.hsnCode}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-right">
                      <div className="flex justify-end">
                        <Link 
                          href={`/inventory/products/${product.id}/edit`} 
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
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <strong>{filteredProducts.length}</strong> of{" "}
              <strong>{products.length}</strong> products
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