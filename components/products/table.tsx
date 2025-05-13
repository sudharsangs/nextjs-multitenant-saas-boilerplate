"use client";

import React, { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
import { 
  MoreHorizontal,
  Edit, 
  Trash,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  name: string;
  code: string;
  category?: {
    id?: string;
    name?: string;
  };
  totalStock?: number;
  unit: string;
  reorderPoint?: number;
  status: string;
}

interface Props {
  products: Product[];
  renderSortIcon: (field: string) => JSX.Element;
  handleSort: (field: string) => void;
  handleDelete: (productId: string) => Promise<void>;
}

export default function ProductsTable({ 
    products,
    renderSortIcon,
    handleSort,
    handleDelete
}: Props) {
  const router = useRouter();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Update filtered products when products prop changes
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);




  return (
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
                {product.category?.name}
              </td>
              <td className="py-3 px-4 text-sm">
                <div className={
                  product.totalStock === 0
                    ? "text-destructive font-medium"
                    : product.totalStock && product.reorderPoint && product.totalStock < product.reorderPoint
                    ? "text-amber-500 font-medium"
                    : ""
                }>
                  {product?.totalStock?.toLocaleString()}
                </div>
              </td>
              <td className="py-3 px-4 text-sm">
                {product.unit === "PIECE" ? "Piece" : product.unit}
              </td>
              <td className="py-3 px-4 text-sm">
                {product?.reorderPoint?.toLocaleString()}
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
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => router.push(`/inventory/products/${product.id}`)}
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center gap-2 text-destructive cursor-pointer"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash size={14} />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}