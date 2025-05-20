"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";

interface Product {
  id: string;
  name: string;
  code: string;
}

interface Vendor {
  id: string;
  name: string;
  code: string;
}

interface PurchaseOrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendor: Vendor;
  status: "draft" | "pending" | "approved" | "received" | "cancelled";
  totalAmount: number;
  orderDate: string;
  expectedDeliveryDate: string | null;
  notes: string;
  items: PurchaseOrderItem[];
  companyId: string;
}

interface FormData {
  vendorId: string;
  status: PurchaseOrder["status"];
  orderDate: string;
  expectedDeliveryDate: string;
  notes: string;
  items: PurchaseOrderItem[];
}

export default function EditPurchaseOrderPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    vendorId: "",
    status: "draft",
    orderDate: "",
    expectedDeliveryDate: "",
    notes: "",
    items: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [orderResponse, vendorsResponse, productsResponse] =
          await Promise.all([
            api.get<PurchaseOrder>(`/purchase-orders/${params.id}`),
            api.get<Vendor[]>("/vendors"),
            api.get<Product[]>("/products"),
          ]);

        if (orderResponse.success && orderResponse.data) {
          setPurchaseOrder(orderResponse.data);
          setFormData({
            vendorId: orderResponse.data.vendorId,
            status: orderResponse.data.status,
            orderDate: orderResponse.data.orderDate.split("T")[0],
            expectedDeliveryDate: orderResponse.data.expectedDeliveryDate
              ? orderResponse.data.expectedDeliveryDate.split("T")[0]
              : "",
            notes: orderResponse.data.notes,
            items: orderResponse.data.items,
          });
        } else {
          setError(orderResponse.error || "Failed to load purchase order");
        }

        if (vendorsResponse.success && vendorsResponse.data) {
          setVendors(vendorsResponse.data);
        }

        if (productsResponse.success && productsResponse.data) {
          setProducts(productsResponse.data);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await api.put(`/purchase-orders/${params.id}`, formData);

      if (response.success) {
        router.push(`/purchases/orders/${params.id}`);
      } else {
        setError(response.error || "Failed to update purchase order");
      }
    } catch (err) {
      console.error("Error updating purchase order:", err);
      setError("Failed to update purchase order");
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `temp-${Date.now()}`,
          productId: "",
          product: { id: "", name: "", code: "" },
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0,
        },
      ],
    }));
  };

  const removeItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const updateItem = (
    itemId: string,
    field: keyof PurchaseOrderItem,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          if (field === "productId") {
            const product = products.find((p) => p.id === value);
            return {
              ...item,
              productId: value as string,
              product: product || { id: "", name: "", code: "" },
            };
          }
          if (field === "quantity" || field === "unitPrice") {
            const quantity = field === "quantity" ? value : item.quantity;
            const unitPrice = field === "unitPrice" ? value : item.unitPrice;
            return {
              ...item,
              [field]: value,
              totalPrice: Number(quantity) * Number(unitPrice),
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      }),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !purchaseOrder) {
    return (
      <div className="p-4">
        <div className="text-red-500">{error || "Purchase order not found"}</div>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/purchases/orders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Purchase Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/purchases/orders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">
          Edit Purchase Order #{purchaseOrder.orderNumber}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Order Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor
                </label>
                <Select
                  value={formData.vendorId}
                  onValueChange={(value: string) =>
                    setFormData((prev) => ({ ...prev, vendorId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name} ({vendor.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value: PurchaseOrder["status"]) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Date
                </label>
                <input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      orderDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      expectedDeliveryDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <Textarea
                  value={formData.notes}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Order Items</h2>
              <Button type="button" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product
                    </label>
                    <Select
                      value={item.productId}
                      onValueChange={(value: string) =>
                        updateItem(item.id, "productId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateItem(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      min="1"
                      required
                    />
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateItem(
                          item.id,
                          "unitPrice",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total
                    </label>
                    <div className="px-3 py-2 text-sm">
                      ${item.totalPrice.toFixed(2)}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="mt-6"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}

              {formData.items.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No items added to this order
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
} 