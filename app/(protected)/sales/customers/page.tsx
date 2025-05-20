"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await api.get<Customer[]>("/customers");
        if (response.success && response.data) {
          setCustomers(response.data);
        } else {
          setError(response.error || "Failed to load customers");
        }
      } catch (err) {
        console.error("Error loading customers:", err);
        setError("Failed to load customers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.code.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower)
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
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Button onClick={() => router.push("/sales/customers/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Customer
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by name, code, email, or phone..."
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/sales/customers/${customer.id}`)}
                >
                  <td className="px-6 py-4 text-sm">{customer.name}</td>
                  <td className="px-6 py-4 text-sm">{customer.code}</td>
                  <td className="px-6 py-4 text-sm">{customer.email}</td>
                  <td className="px-6 py-4 text-sm">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    {customer.city}, {customer.state} {customer.pincode}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(customer.lastUpdated).toLocaleString()}
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