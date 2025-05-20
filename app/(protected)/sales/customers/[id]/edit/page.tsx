"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface FormData {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function EditCustomerPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    code: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.get<Customer>(`/customers/${params.id}`);
        if (response.success && response.data) {
          const customer = response.data;
          setFormData({
            name: customer.name,
            code: customer.code,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            state: customer.state,
            pincode: customer.pincode,
          });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await api.put<Customer>(`/customers/${params.id}`, formData);
      if (response.success && response.data) {
        router.push(`/sales/customers/${params.id}`);
      } else {
        setError(response.error || "Failed to update customer");
      }
    } catch (err) {
      console.error("Error updating customer:", err);
      setError("Failed to update customer");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormData
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

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
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/sales/customers/${params.id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Edit Customer</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange(e, "name")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange(e, "code")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange(e, "email")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange(e, "phone")}
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Address</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange(e, "address")}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange(e, "city")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange(e, "state")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleChange(e, "pincode")}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/sales/customers/${params.id}`)}
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