"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

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

export default function ViewStockPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [stockItem, setStockItem] = useState<StockItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<StockItem>(`/stock/${id}`);
        if (response.success && response.data) {
          setStockItem(response.data);
        } else {
          setError(response.error || 'Failed to load stock item');
        }
      } catch (err) {
        console.error('Error loading stock item:', err);
        setError('Failed to load stock item');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !stockItem) {
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
            <h1 className="text-2xl font-bold">Stock Item Details</h1>
          </div>
          <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-700">
            <p>{error || 'Stock item not found'}</p>
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="mt-4"
            >
              Go Back
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Stock Item Details</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/inventory/stock/${id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Product Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Product Name</p>
                  <p className="font-medium">{stockItem.product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Product Code</p>
                  <p className="font-medium">{stockItem.product.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{stockItem.product.category.name}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Stock Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">{stockItem.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{stockItem.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Batch Number</p>
                  <p className="font-medium">{stockItem.batchNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{stockItem.status}</p>
                </div>
                {stockItem.expiryDate && (
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="font-medium">
                      {new Date(stockItem.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(stockItem.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 