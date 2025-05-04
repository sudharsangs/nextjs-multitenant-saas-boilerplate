"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calendar } from "lucide-react";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";

// Mock products for the form
const mockProducts = [
  { id: "prod1", name: "Steel Bolts (10mm)", code: "STL-B10" },
  { id: "prod2", name: "Aluminum Sheet (2mm)", code: "ALU-S2" },
  { id: "prod3", name: "Plastic Housing Type B", code: "PLT-HB" },
  { id: "prod4", name: "Circuit Board X1", code: "CBX-001" },
  { id: "prod5", name: "LED Bulbs 5W", code: "LED-B5W" },
];

// Batch status values from batchStatusEnum
const batchStatusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "EXPIRED", label: "Expired" },
  { value: "RECALLED", label: "Recalled" },
];

export default function NewBatchPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    batchNumber: "",
    productId: "",
    manufacturingDate: formatDate(new Date()),
    expiryDate: "",
    quantity: "",
    status: "ACTIVE",
    notes: "",
  });

  // Format date for input field - YYYY-MM-DD
  function formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

  // Generate a unique batch number when a product is selected
  useEffect(() => {
    if (formData.productId) {
      const selectedProd = mockProducts.find(p => p.id === formData.productId);
      if (selectedProd) {
        setSelectedProduct(selectedProd);
        const timestamp = new Date().getTime().toString().slice(-6);
        const newBatchNumber = `${selectedProd.code}-${timestamp}`;
        setFormData(prev => ({ ...prev, batchNumber: newBatchNumber }));
      }
    }
  }, [formData.productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert numeric field
      const payload = { 
        ...formData,
        quantity: parseInt(formData.quantity, 10)
      };

      // API call would go here
      console.log("Submitting batch data:", payload);
      
      // Mock successful API call
      setTimeout(() => {
        router.push("/inventory/batches");
        setIsSubmitting(false);
      }, 1000);
      
      // Actual API call would look like:
      // const response = await fetch("/api/v1/batches", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      //
      // if (response.ok) {
      //   router.push("/inventory/batches");
      // } else {
      //   const errorData = await response.json();
      //   console.error("Error creating batch:", errorData);
      // }
    } catch (error) {
      console.error("Error creating batch:", error);
      setIsSubmitting(false);
    }
  };

  // Calculate shelf life based on manufacturing and expiry dates
  const calculateShelfLife = () => {
    if (!formData.manufacturingDate || !formData.expiryDate) return "";
    
    const mfgDate = new Date(formData.manufacturingDate);
    const expDate = new Date(formData.expiryDate);
    
    if (isNaN(mfgDate.getTime()) || isNaN(expDate.getTime())) return "";
    
    const diffTime = Math.abs(expDate.getTime() - mfgDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} days`;
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
          <h1 className="text-2xl font-bold">Create New Batch</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main batch information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Batch Information</CardTitle>
                  <CardDescription>
                    Basic details about the product batch
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="productId" className="text-sm font-medium">
                        Product <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="productId"
                        name="productId"
                        value={formData.productId}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        required
                      >
                        <option value="">Select a product</option>
                        {mockProducts.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="batchNumber" className="text-sm font-medium">
                        Batch Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="batchNumber"
                        name="batchNumber"
                        value={formData.batchNumber}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Auto-generated batch number"
                        readOnly
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Auto-generated based on product code and timestamp
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="manufacturingDate" className="text-sm font-medium">
                        Manufacturing Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="manufacturingDate"
                          name="manufacturingDate"
                          type="date"
                          value={formData.manufacturingDate}
                          onChange={handleChange}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          required
                        />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="expiryDate" className="text-sm font-medium">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <input
                          id="expiryDate"
                          name="expiryDate"
                          type="date"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  {formData.manufacturingDate && formData.expiryDate && (
                    <div className="bg-muted rounded-md p-2 text-sm">
                      Shelf Life: <span className="font-medium">{calculateShelfLife()}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="quantity" className="text-sm font-medium">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Enter quantity"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        {selectedProduct && `Units: ${selectedProduct.unit || 'Piece'}`}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="status" className="text-sm font-medium">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        {batchStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      placeholder="Any additional information about this batch"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Batch Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedProduct ? (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Product</div>
                      <div className="font-medium">{selectedProduct.name}</div>
                      <div className="text-sm text-muted-foreground mt-4">Product Code</div>
                      <div className="font-medium">{selectedProduct.code}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Select a product to see summary information
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/inventory/batches')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting || !formData.productId}
                    className="flex gap-1"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Batch"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}