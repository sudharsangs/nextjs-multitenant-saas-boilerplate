"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api-client";

interface ProductionOrder {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    code: string;
  };
  quantity: number;
  status: "draft" | "in_progress" | "completed" | "cancelled";
  startDate: string;
  endDate: string | null;
  notes: string;
  companyId: string;
}

export default function ProductionOrdersPage() {
  const router = useRouter();
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchProductionOrders = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<ProductionOrder[]>("/production-orders");
        if (response.success && response.data) {
          setProductionOrders(response.data);
        } else {
          setError(response.error || "Failed to load production orders");
        }
      } catch (err) {
        console.error("Error loading production orders:", err);
        setError("Failed to load production orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductionOrders();
  }, []);

  const filteredOrders = productionOrders.filter((order) => {
    const matchesSearch = 
      order.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Production Orders</h1>
        <Button onClick={() => router.push("/manufacturing/production-orders/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Production Order
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by product name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg shadow">
        {error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No production orders found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all"
                ? "No results match your search criteria"
                : "Get started by creating your first production order"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Quantity</th>
                  <th className="text-left p-4">Start Date</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => router.push(`/manufacturing/production-orders/${order.id}`)}
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{order.product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.product.code}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{order.quantity}</td>
                    <td className="p-4">
                      {new Date(order.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : order.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status.split("_").map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(" ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/manufacturing/production-orders/${order.id}/edit`);
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}