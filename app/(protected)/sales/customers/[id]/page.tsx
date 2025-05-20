"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

interface Customer {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  companyId: string;
  lastUpdated: string;
}

export default function ViewCustomerPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get<Customer>(`/customers/${params.id}`);
        if (response.success && response.data) {
          setCustomer(response.data);
        } else {
          setError(response.error || "Failed to load customer");
        }
      } catch (err) {
        console.error("Error loading customer:", err);
        setError("Failed to load customer");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-4">
        <div className="text-red-500">{error || "Customer not found"}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/sales/customers")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">{customer.name}</h1>
        </div>
        <Button onClick={() => router.push(`/sales/customers/${params.id}/edit`)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Code</label>
              <p className="mt-1">{customer.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1">{customer.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="mt-1">{customer.phone}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Address</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Street Address</label>
              <p className="mt-1">{customer.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">City</label>
              <p className="mt-1">{customer.city}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">State</label>
              <p className="mt-1">{customer.state}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Pincode</label>
              <p className="mt-1">{customer.pincode}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Button
            variant="outline"
            onClick={() => router.push(`/sales/orders?customerId=${customer.id}`)}
          >
            View All Orders
          </Button>
        </div>
        <div className="text-center text-gray-500 py-8">
          Loading recent orders...
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Invoices</h2>
          <Button
            variant="outline"
            onClick={() => router.push(`/sales/invoices?customerId=${customer.id}`)}
          >
            View All Invoices
          </Button>
        </div>
        <div className="text-center text-gray-500 py-8">
          Loading recent invoices...
        </div>
      </div>
    </div>
  );
} 