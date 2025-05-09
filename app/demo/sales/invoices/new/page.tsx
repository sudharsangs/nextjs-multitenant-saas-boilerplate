"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Trash, 
  Calendar,
  Save,
  Printer,
  FileDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent} from "@/components/ui/card";
import { groupBy } from "lodash";
import { ClassicTemplate } from '@/components/invoice-templates/ClassicTemplate';
import { ModernTemplate } from '@/components/invoice-templates/ModernTemplate';
import { ProfessionalTemplate } from '@/components/invoice-templates/ProfessionalTemplate';
import { MinimalTemplate } from '@/components/invoice-templates/MinimalTemplate';
import { ElegantTemplate } from '@/components/invoice-templates/ElegantTemplate';
import { CorporateTemplate } from '@/components/invoice-templates/CorporateTemplate';
import { CreativeTemplate } from '@/components/invoice-templates/CreativeTemplate';
import { BoutiqueTemplate } from '@/components/invoice-templates/BoutiqueTemplate';

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
  { id: "prod1", name: "Steel Bolts (10mm)", code: "STL-B10", unit: "PIECE", price: 25.00, tax: 18 },
  { id: "prod2", name: "Aluminum Sheet (2mm)", code: "ALU-S2", unit: "KG", price: 175.50, tax: 18 },
  { id: "prod3", name: "Plastic Housing Type B", code: "PLT-HB", unit: "PIECE", price: 120.75, tax: 12 },
  { id: "prod4", name: "Circuit Board X1", code: "CBX-001", unit: "PIECE", price: 350.25, tax: 18 },
  { id: "prod5", name: "LED Bulbs 5W", code: "LED-B5W", unit: "PIECE", price: 45.00, tax: 12 },
];

// Define customer type
interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  gstin: string;
}

interface InvoiceItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  tax: number;
  amount: number;
}

interface FormData {
  customer: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  items: InvoiceItem[];
  notes: string;
  template: string;
  subtotal: number;
  taxTotal: number;
  total: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Invoice templates
const invoiceTemplates: Template[] = [
  { 
    id: "classic", 
    name: "Classic", 
    description: "Traditional blue-themed layout with clean lines",
    category: "Basic"
  },
  { 
    id: "modern", 
    name: "Modern", 
    description: "Contemporary design with gradient accents",
    category: "Contemporary"
  },
  { 
    id: "professional", 
    name: "Professional", 
    description: "Formal design with subtle navy and gold",
    category: "Business"
  },
  { 
    id: "minimal", 
    name: "Minimal", 
    description: "Monochromatic design with perfect spacing",
    category: "Basic"
  },
  { 
    id: "elegant", 
    name: "Elegant", 
    description: "Sophisticated design with emerald accents",
    category: "Premium"
  },
  { 
    id: "corporate", 
    name: "Corporate", 
    description: "Bold design with royal blue and white",
    category: "Business"
  },
  { 
    id: "creative", 
    name: "Creative", 
    description: "Artistic layout with purple gradients",
    category: "Premium"
  },
  { 
    id: "boutique", 
    name: "Boutique", 
    description: "Luxurious design with rose gold elements",
    category: "Premium"
  }
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

// Define customer type
interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  gstin: string;
}

interface InvoiceItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  tax: number;
  amount: number;
}

interface FormData {
  customer: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  items: InvoiceItem[];
  notes: string;
  template: string;
  subtotal: number;
  taxTotal: number;
  total: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");
  const [formData, setFormData] = useState<FormData>({
    customer: "",
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0')}`,
    invoiceDate: formatDate(new Date()),
    dueDate: formatDate(addDays(new Date(), 30)),
    paymentTerms: "30days",
    items: [],
    notes: "Thank you for your business.",
    template: "classic",
    subtotal: 0,
    taxTotal: 0,
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

  // Update due date based on payment terms
  useEffect(() => {
    if (formData.paymentTerms && formData.invoiceDate) {
      const baseDate = new Date(formData.invoiceDate);
      let days = 0;
      
      switch(formData.paymentTerms) {
        case "immediate": days = 0; break;
        case "7days": days = 7; break;
        case "15days": days = 15; break;
        case "30days": days = 30; break;
        case "45days": days = 45; break;
        case "60days": days = 60; break;
      }
      
      setFormData(prev => ({
        ...prev,
        dueDate: formatDate(addDays(baseDate, days))
      }));
    }
  }, [formData.paymentTerms, formData.invoiceDate]);

  // Update selected customer
  useEffect(() => {
    if (formData.customer) {
      const customer = mockCustomers.find(c => c.id === formData.customer);
      setSelectedCustomer(customer || null);
    }
  }, [formData.customer]);

  // Calculate totals when items change
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxTotal = formData.items.reduce((sum, item) => sum + ((item.price * item.quantity) * item.tax / 100), 0);
    const total = subtotal + taxTotal;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      taxTotal,
      total
    }));
  }, [formData.items]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    setFormData({
      ...formData,
      template: templateId
    });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item_${Date.now()}`,
      productId: "",
      description: "",
      quantity: 1,
      unit: "PIECE",
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

  const handleItemChange = (itemId: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = formData.items.map(item => {
      if (item.id === itemId) {
        let updatedItem = { ...item, [field]: value };
        
        // If changing product, update product-related fields
        if (field === 'productId' && typeof value === 'string') {
          const product = mockProducts.find(p => p.id === value);
          if (product) {
            updatedItem = {
              ...updatedItem,
              description: product.name,
              unit: product.unit,
              price: product.price,
              tax: product.tax,
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

    try {
      // Redirect to the demo page instead of submitting
      setTimeout(() => {
        router.push("/demo/sales/invoices");
      }, 1000);
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Get the current template preview content
    let templateContent = '';
    const invoiceTemplate = document.querySelector('.bg-white.rounded-lg');
    if (invoiceTemplate) {
      templateContent = invoiceTemplate.outerHTML;
    }

    // Create print-specific styles
    const printStyles = `
      <style>
        @media print {
          body {
            padding: 20px;
            margin: 0;
          }
          .print-invoice {
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0;
          }
        }
      </style>
    `;

    // Set the content of the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${formData.invoiceNumber}</title>
          ${printStyles}
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
          <div class="print-invoice">
            ${templateContent}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for styles to load
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    alert('In a real application, this would download the invoice as a PDF');
  };

  // Classic Template Preview

  // Modern Template Preview

  // Professional Template Preview

  // Minimal Template Preview

  // Elegant Template Preview

  // Corporate Template Preview

  // Creative Template Preview

  // Main Form UI
  return (
    <div className="flex min-h-screen">
      {/* Left Section: Form */}
      <div className="w-1/2 border-r border-border bg-background p-6 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-background pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Create New Invoice</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={handleDownload}
              >
                <FileDown className="h-4 w-4" />
                Download
              </Button>
              <Button 
                type="submit" 
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Template Selection Card */}
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Invoice Template</CardTitle>
              <CardDescription>Choose how your invoice looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(groupBy(invoiceTemplates, 'category')).map(([category, templates]) => (
                  <div key={category} className="col-span-2">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {templates.map((template: Template) => (
                        <div
                          key={template.id}
                          className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedTemplate === template.id
                              ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => handleTemplateChange(template.id)}
                        >
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Details Card */}
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>
                Basic details about the invoice
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
                  <label htmlFor="invoiceNumber" className="text-sm font-medium">
                    Invoice Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="invoiceNumber"
                    name="invoiceNumber"
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="invoiceDate" className="text-sm font-medium">
                    Invoice Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="invoiceDate"
                      name="invoiceDate"
                      type="date"
                      value={formData.invoiceDate}
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
                  <label htmlFor="dueDate" className="text-sm font-medium">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2"
                      required
                      readOnly={formData.paymentTerms !== ""}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items Card */}
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>Invoice Items</CardTitle>
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
                    <p className="text-muted-foreground">No items added yet. Click &apos;Add Item&apos; to begin.</p>
                  </div>
                ) : (
                  formData.items.map((item) => (
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
                          <label htmlFor={`item-product-${item.id}`} className="text-sm font-medium">
                            Product
                          </label>
                          <select
                            id={`item-product-${item.id}`}
                            value={item.productId}
                            onChange={(e) => handleItemChange(item.id, 'productId', e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          >
                            <option value="">Select a product</option>
                            {mockProducts.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name} ({product.code})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`item-description-${item.id}`} className="text-sm font-medium">
                            Description
                          </label>
                          <input
                            id={`item-description-${item.id}`}
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            placeholder="Item description"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mt-4">
                        <div className="space-y-2">
                          <label htmlFor={`item-quantity-${item.id}`} className="text-sm font-medium">
                            Quantity
                          </label>
                          <input
                            id={`item-quantity-${item.id}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`item-price-${item.id}`} className="text-sm font-medium">
                            Price
                          </label>
                          <input
                            id={`item-price-${item.id}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.price}
                            onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor={`item-tax-${item.id}`} className="text-sm font-medium">
                            Tax %
                          </label>
                          <input
                            id={`item-tax-${item.id}`}
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
                  <div className="flex justify-between py-2 border-t-2">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">₹{formData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information Card */}
          <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
                  placeholder="Any additional information or terms"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Section: Live Preview */}
      <div className="w-1/2 bg-gray-50 p-6 overflow-y-auto sticky top-0 h-screen">
        <div className="sticky top-6">
          <div className="bg-white rounded-lg shadow-md">
            {selectedTemplate === "classic" && <ClassicTemplate formData={formData} selectedCustomer={selectedCustomer} paymentTermsOptions={paymentTermsOptions} />}
            {selectedTemplate === "modern" && <ModernTemplate formData={formData} selectedCustomer={selectedCustomer} paymentTermsOptions={paymentTermsOptions} />}
            {selectedTemplate === "professional" && <ProfessionalTemplate formData={formData} selectedCustomer={selectedCustomer} paymentTermsOptions={paymentTermsOptions} />}
            {selectedTemplate === "minimal" && <MinimalTemplate formData={formData} selectedCustomer={selectedCustomer} paymentTermsOptions={paymentTermsOptions} />}
            {selectedTemplate === "elegant" && <ElegantTemplate formData={formData} selectedCustomer={selectedCustomer} paymentTermsOptions={paymentTermsOptions} />}
            {selectedTemplate === "corporate" && <CorporateTemplate formData={formData} selectedCustomer={selectedCustomer} paymentTermsOptions={paymentTermsOptions} />}
            {selectedTemplate === "creative" && <CreativeTemplate formData={formData} selectedCustomer={selectedCustomer} paymentTermsOptions={paymentTermsOptions} />}
            {selectedTemplate === "boutique" && <BoutiqueTemplate formData={formData} selectedCustomer={selectedCustomer} paymentTermsOptions={paymentTermsOptions} />}
          </div>
        </div>
      </div>
    </div>
  );
}