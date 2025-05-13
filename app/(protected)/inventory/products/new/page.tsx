"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import ProductForm from "@/components/products/form";

interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
}

const unitTypes = [
  { value: "PIECE", label: "Piece" },
  { value: "KG", label: "Kilogram" },
  { value: "LITER", label: "Liter" },
  { value: "METER", label: "Meter" },
  { value: "SQUARE_METER", label: "Square Meter" },
  { value: "CUBIC_METER", label: "Cubic Meter" },
];

interface ProductFormData {
  name: string;
  code: string;
  description: string;
  categoryId: string;
  hsnCode: string;
  unit: string;
  reorderPoint: string;
  safetyStock: string;
  leadTime: string;
  shelfLife: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<Category[]>('/categories');
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          setError(response.error || 'Failed to load categories');
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);


  const handleSubmit = async (formData: ProductFormData) => {

    try {
      const payload = {
        ...formData,
        reorderPoint: formData.reorderPoint ? parseInt(formData.reorderPoint, 10) : undefined,
        safetyStock: formData.safetyStock ? parseInt(formData.safetyStock, 10) : undefined,
        leadTime: formData.leadTime ? parseInt(formData.leadTime, 10) : undefined,
        shelfLife: formData.shelfLife ? parseInt(formData.shelfLife, 10) : undefined,
      };

      const response = await api.post('/products', payload);
      
      if (response.success) {
        router.push("/inventory/products");
      } else {
        console.error("Error creating product:", response.error);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } 
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
          <h1 className="text-2xl font-bold">Create New Product</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p>Loading categories...</p>
          </div>
        ) : (
          <ProductForm 
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