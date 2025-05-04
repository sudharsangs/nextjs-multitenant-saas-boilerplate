"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
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

// Mock categories for the form
const mockCategories = [
  { id: "cat1", name: "Raw Materials" },
  { id: "cat2", name: "Finished Goods" },
  { id: "cat3", name: "Packaging Materials" },
  { id: "cat4", name: "Electrical Components" },
  { id: "cat5", name: "Mechanical Parts" },
];

// Mock units from the unitTypeEnum
const unitTypes = [
  { value: "PIECE", label: "Piece" },
  { value: "KG", label: "Kilogram" },
  { value: "LITER", label: "Liter" },
  { value: "METER", label: "Meter" },
  { value: "SQUARE_METER", label: "Square Meter" },
  { value: "CUBIC_METER", label: "Cubic Meter" },
];

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    categoryId: "",
    hsnCode: "",
    unit: "PIECE",
    reorderPoint: "",
    safetyStock: "",
    leadTime: "",
    shelfLife: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert numeric fields
      const numericFields = ['reorderPoint', 'safetyStock', 'leadTime', 'shelfLife'];
      const payload = { ...formData };
      
      numericFields.forEach(field => {
        if (payload[field]) {
          payload[field] = parseInt(payload[field], 10);
        }
      });

      // API call would go here
      console.log("Submitting product data:", payload);
      
      // Mock successful API call
      setTimeout(() => {
        router.push("/inventory/products");
        setIsSubmitting(false);
      }, 1000);
      
      // Actual API call would look like:
      // const response = await fetch("/api/v1/products", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      //
      // if (response.ok) {
      //   router.push("/inventory/products");
      // } else {
      //   const errorData = await response.json();
      //   console.error("Error creating product:", errorData);
      // }
    } catch (error) {
      console.error("Error creating product:", error);
      setIsSubmitting(false);
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main product information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>
                    Basic details about the product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="code" className="text-sm font-medium">
                        Product Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="e.g., PRD-001"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="categoryId" className="text-sm font-medium">
                        Category
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="">Select a category</option>
                        {mockCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="hsnCode" className="text-sm font-medium">
                        HSN Code
                      </label>
                      <input
                        id="hsnCode"
                        name="hsnCode"
                        value={formData.hsnCode}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="e.g., 8473"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Settings</CardTitle>
                  <CardDescription>
                    Configure inventory management parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="reorderPoint" className="text-sm font-medium">
                        Reorder Point
                      </label>
                      <input
                        id="reorderPoint"
                        name="reorderPoint"
                        type="number"
                        value={formData.reorderPoint}
                        onChange={handleChange}
                        min="0"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Minimum quantity before reorder"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="safetyStock" className="text-sm font-medium">
                        Safety Stock
                      </label>
                      <input
                        id="safetyStock"
                        name="safetyStock"
                        type="number"
                        value={formData.safetyStock}
                        onChange={handleChange}
                        min="0"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Buffer inventory amount"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="leadTime" className="text-sm font-medium">
                        Lead Time (days)
                      </label>
                      <input
                        id="leadTime"
                        name="leadTime"
                        type="number"
                        value={formData.leadTime}
                        onChange={handleChange}
                        min="0"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Avg. days to receive order"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="shelfLife" className="text-sm font-medium">
                        Shelf Life (days)
                      </label>
                      <input
                        id="shelfLife"
                        name="shelfLife"
                        type="number"
                        value={formData.shelfLife}
                        onChange={handleChange}
                        min="0"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Product shelf life"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="unit" className="text-sm font-medium">
                      Unit of Measure <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      {unitTypes.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/inventory/products')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex gap-1"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Product"}
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