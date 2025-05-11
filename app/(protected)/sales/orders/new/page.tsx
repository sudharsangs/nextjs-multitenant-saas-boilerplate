"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { api } from "@/lib/api-client";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Product {
  id: string;
  name: string;
  code: string;
  description?: string;
  unit: 'PIECE' | 'KG' | 'LITER' | 'METER' | 'SQUARE_METER' | 'CUBIC_METER';
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: Product;
}

interface FormData {
  customerId: string;
  orderNumber: string;
  orderDate: string;
  expectedShipDate: string;
  items: OrderItem[];
  notes: string;
  totalAmount: number;
}

export default function NewOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    customerId: "",
    orderNumber: `ORD-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0')}`,
    orderDate: new Date().toISOString().split('T')[0],
    expectedShipDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    notes: "",
    totalAmount: 0
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const companyId = localStorage.getItem('companyId'); // This should come from auth context
        
        // Fetch customers
        const customersResponse = await api.get<Customer[]>(`/customers?companyId=${companyId}`);
        if (customersResponse.success && customersResponse.data) {
          setCustomers(customersResponse.data);
        }

        // Fetch products
        const productsResponse = await api.get<Product[]>(`/products?companyId=${companyId}`);
        if (productsResponse.success && productsResponse.data) {
          setProducts(productsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load required data');
      }
    };

    fetchInitialData();
  }, []);

  // Update selected customer when customerId changes
  useEffect(() => {
    if (formData.customerId) {
      const customer = customers.find(c => c.id === formData.customerId) || null;
      setSelectedCustomer(customer);
    }
  }, [formData.customerId, customers]);

  // Calculate total amount when items change
  useEffect(() => {
    const total = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    setFormData(prev => ({
      ...prev,
      totalAmount: total
    }));
  }, [formData.items]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItem = () => {
    const newItem: OrderItem = {
      id: `temp_${Date.now()}`,
      productId: "",
      quantity: 1,
      unitPrice: 0
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const handleItemChange = (itemId: string, field: keyof OrderItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          
          // If changing product, update product details
          if (field === 'productId') {
            const product = products.find(p => p.id === value);
            if (product) {
              updatedItem.product = product;
            }
          }
          
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      setError('Please add at least one item to the order');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const companyId = localStorage.getItem('companyId'); // This should come from auth context
      const payload = {
        ...formData,
        companyId,
        status: 'DRAFT'
      };

      const response = await api.post('/sales/orders', payload);
      
      if (response.success) {
        router.push(`/sales/orders/${response.data.id}`);
      } else {
        throw new Error(response.error || 'Failed to create order');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err instanceof Error ? err.message : 'Failed to create order');
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push("/sales/orders")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Create New Order</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Basic details about the order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="customerId" className="text-sm font-medium">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  id="customerId"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="orderNumber" className="text-sm font-medium">
                  Order Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="orderNumber"
                  name="orderNumber"
                  type="text"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="orderDate" className="text-sm font-medium">
                  Order Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="orderDate"
                    name="orderDate"
                    type="date"
                    value={formData.orderDate}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="expectedShipDate" className="text-sm font-medium">
                  Expected Ship Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="expectedShipDate"
                    name="expectedShipDate"
                    type="date"
                    value={formData.expectedShipDate}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2"
                    required
                  />
                </div>
              </div>
            </div>

            {selectedCustomer && (
              <div className="rounded-lg bg-muted p-4">
                <h4 className="text-sm font-medium mb-2">Customer Details</h4>
                <dl className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                  <div>
                    <dt className="text-muted-foreground">Contact</dt>
                    <dd>{selectedCustomer.email}</dd>
                    <dd>{selectedCustomer.phone}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-muted-foreground">Address</dt>
                    <dd>
                      {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.pincode}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>Add products to this order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <select
                      value={item.productId}
                      onChange={(e) => handleItemChange(item.id, 'productId', e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value))}
                      min="1"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    ₹{(item.quantity * item.unitPrice).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                  <div className="col-span-1 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>

              {formData.items.length > 0 && (
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between text-base font-medium">
                    <span>Total Amount</span>
                    <span>₹{formData.totalAmount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</span>
                  </div>
                </div>
              )}
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
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/sales/orders")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || formData.items.length === 0}
          >
            {isSubmitting ? "Creating..." : "Create Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}