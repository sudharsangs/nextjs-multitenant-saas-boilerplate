"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendor: {
    id: string;
    name: string;
    code: string;
  };
  status: "draft" | "pending" | "approved" | "received" | "cancelled";
  totalAmount: number;
  orderDate: string;
  expectedDeliveryDate: string | null;
  notes: string;
  companyId: string;
  lastUpdated: string;
}

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await api.get<PurchaseOrder[]>("/purchase-orders");
        if (response.success && response.data) {
          setPurchaseOrders(response.data);
        } else {
          setError(response.error || "Failed to load purchase orders");
        }
      } catch (err) {
        console.error("Error loading purchase orders:", err);
        setError("Failed to load purchase orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseOrders();
  }, []);

  const filteredOrders = purchaseOrders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.vendor.name.toLowerCase().includes(searchLower) ||
      order.vendor.code.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Purchase Orders</h1>
        <Button onClick={() => router.push("/purchases/orders/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by order number or vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-card rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Order Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Expected Delivery
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/purchases/orders/${order.id}`)}
                >
                  <td className="px-6 py-4 text-sm">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm">
                    {order.vendor.name} ({order.vendor.code})
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "received"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {order.expectedDeliveryDate
                      ? new Date(order.expectedDeliveryDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(order.lastUpdated).toLocaleString()}
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