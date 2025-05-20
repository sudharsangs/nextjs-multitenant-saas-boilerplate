"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

interface SalesOrderItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    code: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: {
    id: string;
    name: string;
    code: string;
    email: string;
    phone: string;
    address: string;
  };
  status: "draft" | "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  orderDate: string;
  expectedDeliveryDate: string | null;
  notes: string;
  items: SalesOrderItem[];
  companyId: string;
  lastUpdated: string;
}

export default function ViewSalesOrderPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [salesOrder, setSalesOrder] = useState<SalesOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesOrder = async () => {
      try {
        const response = await api.get<SalesOrder>(`/sales-orders/${params.id}`);
        if (response.success && response.data) {
          setSalesOrder(response.data);
        } else {
          setError(response.error || "Failed to load sales order");
        }
      } catch (err) {
        console.error("Error loading sales order:", err);
        setError("Failed to load sales order");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesOrder();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !salesOrder) {
    return (
      <div className="p-4">
        <div className="text-red-500">{error || "Sales order not found"}</div>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/sales/orders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sales Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/sales/orders")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">
            Sales Order #{salesOrder.orderNumber}
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/sales/orders/${params.id}/edit`)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Customer Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Customer Name</p>
              <p className="font-medium">{salesOrder.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer Code</p>
              <p className="font-medium">{salesOrder.customer.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{salesOrder.customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{salesOrder.customer.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{salesOrder.customer.address}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Order Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    salesOrder.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : salesOrder.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : salesOrder.status === "shipped"
                      ? "bg-blue-100 text-blue-800"
                      : salesOrder.status === "delivered"
                      ? "bg-purple-100 text-purple-800"
                      : salesOrder.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {salesOrder.status.charAt(0).toUpperCase() +
                    salesOrder.status.slice(1)}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">
                {new Date(salesOrder.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expected Delivery</p>
              <p className="font-medium">
                {salesOrder.expectedDeliveryDate
                  ? new Date(
                      salesOrder.expectedDeliveryDate
                    ).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">
                ${salesOrder.totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Notes</p>
              <p className="font-medium whitespace-pre-wrap">
                {salesOrder.notes || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Total Price
                </th>
              </tr>
            </thead>
            <tbody>
              {salesOrder.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-6 py-4 text-sm">
                    {item.product.name} ({item.product.code})
                  </td>
                  <td className="px-6 py-4 text-sm">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    ${item.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}