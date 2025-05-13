"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import ProductForm from "@/components/products/form";
import { ProductFormData } from "@/components/products/types";

interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
}

interface Product extends ProductFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const unitTypes = [
  { value: "PIECE", label: "Piece" },
  { value: "KG", label: "Kilogram" },
  { value: "LITER", label: "Liter" },
  { value: "METER", label: "Meter" },
  { value: "SQUARE_METER", label: "Square Meter" },
  { value: "CUBIC_METER", label: "Cubic Meter" },
];

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch product and categories in parallel
        const [productResponse, categoriesResponse] = await Promise.all([
          api.get<Product>(`/products/${id}`),
          api.get<Category[]>('/categories')
        ]);

        if (productResponse.success && productResponse.data) {
          // Format the data for the form
          setProduct(productResponse.data);
        } else {
          setError(productResponse.error || 'Failed to load product details');
        }

        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        } else {
          setError(error => error || categoriesResponse.error || 'Failed to load categories');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load required data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      // Format numeric fields for API
      const payload = {
        ...formData,
        reorderPoint: formData.reorderPoint ? parseInt(formData.reorderPoint, 10) : undefined,
        safetyStock: formData.safetyStock ? parseInt(formData.safetyStock, 10) : undefined,
        leadTime: formData.leadTime ? parseInt(formData.leadTime, 10) : undefined,
        shelfLife: formData.shelfLife ? parseInt(formData.shelfLife, 10) : undefined,
      };

      const response = await api.put(`/products/${id}`, payload);
      
      if (response.success) {
        router.push("/inventory/products");
      } else {
        setError(response.error || "Failed to update product");
        console.error("Error updating product:", response.error);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("An unexpected error occurred");
    }
  };

  // Prepare the form data from product
  const getFormData = (): ProductFormData | undefined => {
    if (!product) return undefined;

    return {
      name: product.name,
      code: product.code,
      description: product.description,
      categoryId: product.categoryId,
      hsnCode: product.hsnCode,
      unit: product.unit,
      reorderPoint: product.reorderPoint?.toString() || "",
      safetyStock: product.safetyStock?.toString() || "",
      leadTime: product.leadTime?.toString() || "",
      shelfLife: product.shelfLife?.toString() || "",
    };
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Product</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p>Loading product data...</p>
          </div>
        ) : error ? (
          <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-700">
            <p>{error}</p>
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="mt-4"
            >
              Go Back
            </Button>
          </div>
        ) : (
          <ProductForm 
            initialData={getFormData()}
            categories={categories} 
            unitTypes={unitTypes} 
            onSubmit={handleSubmit} 
            error={error || undefined}
          />
        )}
      </main>
    </div>
  );
}