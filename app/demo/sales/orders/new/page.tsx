"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Users, 
  Plus, 
  Trash, 
  Calendar,
  Truck} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";

// Mock customers data
const mockCustomers = [
  { id: "cust1", name: "Acme Corporation", email: "billing@acme.com", address: "123 Main St, New York, NY 10001", gstin: "29ABCDE1234F1Z5" },
  { id: "cust2", name: "TechSolutions Inc", email: "accounts@techsolutions.com", address: "456 Park Ave, San Francisco, CA 94102", gstin: "27FGHIJ5678K1Z3" },
  { id: "cust3", name: "Global Manufacturing Ltd", email: "finance@globalmanufacturing.com", address: "789 Industry Blvd, Chicago, IL 60007", gstin: "24KLMNO9012P1Z8" },
  { id: "cust4", name: "XYZ Industries", email: "ap@xyzindustries.com", address: "101 Commerce Dr, Austin, TX 78701", gstin: "07PQRST3456U1Z6" },
  { id: "cust5", name: "ABC Enterprises", email: "payments@abcent.com", address: "202 Business Pkwy, Miami, FL 33125", gstin: "33UVWXY7890Z1Z1" },
];

// Mock products data
const mockProducts = [
  { id: "prod1", name: "Steel Bolts (10mm)", code: "STL-B10", unit: "PIECE", price: 25.00, stock: 1250, tax: 18 },
  { id: "prod2", name: "Aluminum Sheet (2mm)", code: "ALU-S2", unit: "KG", price: 175.50, stock: 500, tax: 18 },
  { id: "prod3", name: "Plastic Housing Type B", code: "PLT-HB", unit: "PIECE", price: 120.75, stock: 800, tax: 12 },
  { id: "prod4", name: "Circuit Board X1", code: "CBX-001", unit: "PIECE", price: 350.25, stock: 200, tax: 18 },
  { id: "prod5", name: "LED Bulbs 5W", code: "LED-B5W", unit: "PIECE", price: 45.00, stock: 1500, tax: 12 },
];

// Shipping methods
const shippingMethods = [
  { id: "standard", name: "Standard Shipping", eta: "3-5 days", price: 250.00 },
  { id: "express", name: "Express Shipping", eta: "1-2 days", price: 500.00 },
  { id: "overnight", name: "Overnight Delivery", eta: "Next day", price: 800.00 },
  { id: "pickup", name: "Customer Pickup", eta: "Arranged", price: 0.00 },
];

// Payment terms options
const paymentTermsOptions = [
  { value: "immediate", label: "Due on Receipt" },
  { value: "7days", label: "Net 7 Days" },
  { value: "15days", label: "Net 15 Days" },
  { value: "30days", label: "Net 30 Days" },
  { value: "45days", label: "Net 45 Days" },
  { value: "60days", label: "Net 60 Days" }
];

interface OrderItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unit: string;
  available: number;
  price: number;
  tax: number;
  amount: number;
}

interface FormData {
  customer: string;
  orderNumber: string;
  orderDate: string;
  expectedShipDate: string;
  paymentTerms: string;
  shippingMethod: string;
  items: OrderItem[];
  notes: string;
  subtotal: number;
  taxTotal: number;
  shippingCost: number;
  total: number;
}

export default function NewOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    name: string;
    email: string;
    address: string;
    gstin: string;
} | null>(null);
const [selectedShippingMethod, setSelectedShippingMethod] = useState<{
    id: string;
    name: string;
    eta: string;
    price: number;
} | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    customer: "",
    orderNumber: `ORD-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0')}`,
    orderDate: formatDate(new Date()),
    expectedShipDate: formatDate(addDays(new Date(), 7)),
    paymentTerms: "30days",
    shippingMethod: "",
    items: [],
    notes: "Please deliver during business hours.",
    subtotal: 0,
    taxTotal: 0,
    shippingCost: 0,
    total: 0
  });

  // Format date for input field - YYYY-MM-DD
  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Add days to a date
  function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // Update selected customer
  useEffect(() => {
    if (formData.customer) {
      const customer = mockCustomers.find(c => c.id === formData.customer) || null;
      setSelectedCustomer(customer);
    }
  }, [formData.customer]);

  // Update shipping method
  useEffect(() => {
    if (formData.shippingMethod) {
      const method = shippingMethods.find(m => m.id === formData.shippingMethod) || null;
      setSelectedShippingMethod(method);
      
      setFormData(prev => ({
        ...prev,
        shippingCost: method?.price || 0
      }));
    }
  }, [formData.shippingMethod]);

  // Calculate totals when items or shipping cost change
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxTotal = formData.items.reduce((sum, item) => sum + ((item.price * item.quantity) * item.tax / 100), 0);
    const total = subtotal + taxTotal + formData.shippingCost;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      taxTotal,
      total
    }));
  }, [formData.items, formData.shippingCost]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const addItem = () => {
    const newItem: OrderItem = {
      id: `item_${Date.now()}`,
      productId: "",
      description: "",
      quantity: 1,
      unit: "PIECE",
      available: 0,
      price: 0,
      tax: 18,
      amount: 0
    };
    
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
  };

  const removeItem = (itemId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== itemId)
    });
  };

  const handleItemChange = (itemId: string, field: keyof OrderItem, value: unknown) => {
    const updatedItems = formData.items.map(item => {
      if (item.id === itemId) {
        let updatedItem = { ...item, [field]: value };
        
        // If changing product, update product-related fields
        if (field === 'productId' && value) {
          const product = mockProducts.find(p => p.id === value);
          if (product) {
            updatedItem = {
              ...updatedItem,
              description: product.name,
              unit: product.unit,
              price: product.price,
              tax: product.tax,
              available: product.stock
            };
          }
        }
        
        // Recalculate amount
        updatedItem.amount = updatedItem.price * updatedItem.quantity;
        return updatedItem;
      }
      return item;
    });
    
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API call would go here in a real implementation
      console.log("Submitting order:", formData);
      
      // Mock successful API call
      setTimeout(() => {
        router.push("/sales/orders");
        setIsSubmitting(false);
      }, 1000);
      
      // Actual API call would look like this:
      // const response = await fetch('/api/v1/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // if (response.ok) {
      //   const data = await response.json();
      //   router.push(`/sales/orders/${data.id}`);
      // } else {
      //   // Handle error
      // }
    } catch (error) {
      console.error("Error creating order:", error);
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
          <h1 className="text-2xl font-bold">Create New Sales Order</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main order information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                  <CardDescription>
                    Basic details about the order
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="customer" className="text-sm font-medium">
                        Customer <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="customer"
                        name="customer"
                        value={formData.customer}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        required
                      >
                        <option value="">Select a customer</option>
                        {mockCustomers.map((customer) => (
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
                      <label htmlFor="paymentTerms" className="text-sm font-medium">
                        Payment Terms
                      </label>
                      <select
                        id="paymentTerms"
                        name="paymentTerms"
                        value={formData.paymentTerms}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        {paymentTermsOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="expectedShipDate" className="text-sm font-medium">
                        Expected Ship Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                    <div className="space-y-2">
                      <label htmlFor="shippingMethod" className="text-sm font-medium">
                        Shipping Method <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="shippingMethod"
                        name="shippingMethod"
                        value={formData.shippingMethod}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        required
                      >
                        <option value="">Select shipping method</option>
                        {shippingMethods.map((method) => (
                          <option key={method.id} value={method.id}>
                            {method.name} - ₹{method.price.toFixed(2)} ({method.eta})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>Order Items</CardTitle>
                      <CardDescription>Products in this order</CardDescription>
                    </div>
                    <Button type="button" onClick={addItem} variant="outline" className="flex items-center gap-1">
                      <Plus size={16} />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.items.length === 0 ? (
                      <div className="text-center py-4 border border-dashed rounded-md">
                        <p className="text-muted-foreground">No items added yet. Click Add Items&apos; to begin.</p>
                      </div>
                    ) : (
                      formData.items.map((item, index) => (
                        <div key={item.id} className="border rounded-md p-4 relative">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash size={16} />
                          </Button>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <label htmlFor={`item-product-${index}`} className="text-sm font-medium">
                                Product
                              </label>
                              <select
                                id={`item-product-${index}`}
                                value={item.productId}
                                onChange={(e) => handleItemChange(item.id, 'productId', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                              >
                                <option value="">Select a product</option>
                                {mockProducts.map((product) => (
                                  <option key={product.id} value={product.id}>
                                    {product.name} ({product.code}) - {product.stock} in stock
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label htmlFor={`item-description-${index}`} className="text-sm font-medium">
                                Description
                              </label>
                              <input
                                id={`item-description-${index}`}
                                type="text"
                                value={item.description}
                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                placeholder="Item description"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-5 mt-4">
                            <div className="space-y-2">
                              <label htmlFor={`item-quantity-${index}`} className="text-sm font-medium">
                                Quantity
                              </label>
                              <input
                                id={`item-quantity-${index}`}
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                                className={`w-full rounded-md border ${item.quantity > item.available && item.available > 0 ? 'border-red-500' : 'border-input'} bg-background px-3 py-2`}
                              />
                              {item.available > 0 && (
                                <p className={`text-xs ${item.quantity > item.available ? 'text-red-500' : 'text-muted-foreground'}`}>
                                  {item.available} available
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Unit
                              </label>
                              <input
                                type="text"
                                value={item.unit}
                                className="w-full rounded-md border border-input bg-muted/50 px-3 py-2"
                                readOnly
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor={`item-price-${index}`} className="text-sm font-medium">
                                Price
                              </label>
                              <input
                                id={`item-price-${index}`}
                                type="number"
                                step="0.01"
                                min="0"
                                value={item.price}
                                onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor={`item-tax-${index}`} className="text-sm font-medium">
                                Tax %
                              </label>
                              <input
                                id={`item-tax-${index}`}
                                type="number"
                                min="0"
                                max="100"
                                value={item.tax}
                                onChange={(e) => handleItemChange(item.id, 'tax', parseFloat(e.target.value) || 0)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Amount
                              </label>
                              <div className="w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-right">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <div className="w-full md:w-1/3 space-y-2">
                      <div className="flex justify-between py-2 border-t">
                        <span className="font-medium">Subtotal:</span>
                        <span>₹{formData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Tax:</span>
                        <span>₹{formData.taxTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Shipping:</span>
                        <span>₹{formData.shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 border border-t-2">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold">₹{formData.total.toFixed(2)}</span>
                      </div>
                    </div>
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
                      placeholder="Any additional information or instructions"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Items:</span>
                    <span>{formData.items.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Quantity:</span>
                    <span>{formData.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Amount:</span>
                    <span className="font-medium">₹{formData.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCustomer ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>{selectedCustomer.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">GSTIN</p>
                        <p>{selectedCustomer.gstin}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Select a customer to see their details
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedShippingMethod ? (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Method</p>
                        <p className="font-medium">{selectedShippingMethod.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                        <p>{selectedShippingMethod.eta}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cost</p>
                        <p>₹{selectedShippingMethod.price.toFixed(2)}</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Truck className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Select a shipping method
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/sales/orders')}
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
                    {isSubmitting ? "Saving..." : "Save Order"}
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