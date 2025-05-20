"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer: {
    id: string;
    name: string;
    code: string;
  };
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  notes: string;
  companyId: string;
  lastUpdated: string;
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get<Invoice[]>("/invoices");
        if (response.success && response.data) {
          setInvoices(response.data);
        } else {
          setError(response.error || "Failed to load invoices");
        }
      } catch (err) {
        console.error("Error loading invoices:", err);
        setError("Failed to load invoices");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
      invoice.customer.name.toLowerCase().includes(searchLower) ||
      invoice.customer.code.toLowerCase().includes(searchLower)
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
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Button onClick={() => router.push("/sales/invoices/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by invoice number or customer..."
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
                  Invoice Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/sales/invoices/${invoice.id}`)}
                >
                  <td className="px-6 py-4 text-sm">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4 text-sm">
                    {invoice.customer.name} ({invoice.customer.code})
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : invoice.status === "sent"
                          ? "bg-blue-100 text-blue-800"
                          : invoice.status === "overdue"
                          ? "bg-red-100 text-red-800"
                          : invoice.status === "cancelled"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    ${invoice.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(invoice.lastUpdated).toLocaleString()}
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