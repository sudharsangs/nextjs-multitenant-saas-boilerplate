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
  FileDown,
  CreditCard,
  Check,
  X,
  Eye
} from "lucide-react";
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
  { id: "prod1", name: "Steel Bolts (10mm)", code: "STL-B10", unit: "PIECE", price: 25.00, tax: 18 },
  { id: "prod2", name: "Aluminum Sheet (2mm)", code: "ALU-S2", unit: "KG", price: 175.50, tax: 18 },
  { id: "prod3", name: "Plastic Housing Type B", code: "PLT-HB", unit: "PIECE", price: 120.75, tax: 12 },
  { id: "prod4", name: "Circuit Board X1", code: "CBX-001", unit: "PIECE", price: 350.25, tax: 18 },
  { id: "prod5", name: "LED Bulbs 5W", code: "LED-B5W", unit: "PIECE", price: 45.00, tax: 12 },
];

// Invoice templates
const invoiceTemplates = [
  { id: "classic", name: "Classic", description: "Traditional layout with company logo at top" },
  { id: "modern", name: "Modern", description: "Clean, minimal design with subtle colors" },
  { id: "professional", name: "Professional", description: "Formal design suitable for corporate clients" },
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

export default function NewInvoicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  
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
      
      setFormData({
        ...formData,
        dueDate: formatDate(addDays(baseDate, days))
      });
    }
  }, [formData.paymentTerms, formData.invoiceDate]);

  // Update selected customer
  useEffect(() => {
    if (formData.customer) {
      const customer = mockCustomers.find(c => c.id === formData.customer);
      setSelectedCustomer(customer);
    }
  }, [formData.customer]);

  // Calculate totals when items change
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxTotal = formData.items.reduce((sum, item) => sum + ((item.price * item.quantity) * item.tax / 100), 0);
    const total = subtotal + taxTotal;
    
    setFormData({
      ...formData,
      subtotal,
      taxTotal,
      total
    });
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

  const handleItemChange = (itemId: string, field: keyof InvoiceItem, value: any) => {
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
      console.log("Submitting invoice:", formData);
      
      // Mock successful API call
      setTimeout(() => {
        router.push("/sales/invoices");
        setIsSubmitting(false);
      }, 1000);
      
      // Actual API call would look like this:
      // const response = await fetch('/api/v1/invoices', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // if (response.ok) {
      //   const data = await response.json();
      //   router.push(`/sales/invoices/${data.id}`);
      // } else {
      //   // Handle error
      // }
    } catch (error) {
      console.error("Error creating invoice:", error);
      setIsSubmitting(false);
    }
  };

  const handlePreviewToggle = () => {
    setPreviewMode(!previewMode);
  };

  const generatePDF = () => {
    // In a real application, this would call an API endpoint to generate and download PDF
    alert('PDF would be generated and downloaded here');
    
    // Implementation would be:
    // window.open(`/api/v1/invoices/preview-pdf?data=${encodeURIComponent(JSON.stringify(formData))}`, '_blank');
  };

  // Classic Template Preview
  const ClassicTemplatePreview = () => (
    <div className="border rounded-md p-8 bg-white text-black">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">INVOICE</h1>
          <div className="text-sm mt-4">
            <p className="font-bold">Your Company Name</p>
            <p>Company Address Line 1</p>
            <p>City, State, ZIP</p>
            <p>GSTIN: 12ABCDE1234F1Z5</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold"># {formData.invoiceNumber}</p>
          <p className="mt-2">Invoice Date: {new Date(formData.invoiceDate).toLocaleDateString()}</p>
          <p>Due Date: {new Date(formData.dueDate).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <p className="font-bold">Bill To:</p>
        {selectedCustomer ? (
          <div className="mt-1">
            <p>{selectedCustomer.name}</p>
            <p>{selectedCustomer.address}</p>
            <p>GSTIN: {selectedCustomer.gstin}</p>
            <p>{selectedCustomer.email}</p>
          </div>
        ) : (
          <p className="text-gray-500">No customer selected</p>
        )}
      </div>
      
      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2">Item & Description</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Rate</th>
              <th className="text-right py-2">Tax</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3">
                  <div className="font-medium">{item.description || "Product description"}</div>
                </td>
                <td className="text-right py-3">{item.quantity} {item.unit}</td>
                <td className="text-right py-3">₹{item.price.toFixed(2)}</td>
                <td className="text-right py-3">{item.tax}%</td>
                <td className="text-right py-3">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>₹{formData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Tax Total:</span>
            <span>₹{formData.taxTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>Total:</span>
            <span>₹{formData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <p className="font-medium">Notes:</p>
        <p className="mt-1 text-sm">{formData.notes}</p>
      </div>
      
      <div className="mt-8 text-center text-sm">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );

  // Modern Template Preview
  const ModernTemplatePreview = () => (
    <div className="border rounded-md p-8 bg-white text-black">
      <div className="bg-gray-100 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
          <p className="text-xl font-medium"># {formData.invoiceNumber}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8 p-6">
        <div>
          <p className="text-gray-500 uppercase text-sm">From</p>
          <p className="font-semibold mt-2">Your Company Name</p>
          <div className="mt-1 text-sm">
            <p>Company Address Line 1</p>
            <p>City, State, ZIP</p>
            <p>GSTIN: 12ABCDE1234F1Z5</p>
          </div>
        </div>
        
        <div>
          <p className="text-gray-500 uppercase text-sm">To</p>
          {selectedCustomer ? (
            <div className="mt-2">
              <p className="font-semibold">{selectedCustomer.name}</p>
              <div className="mt-1 text-sm">
                <p>{selectedCustomer.address}</p>
                <p>GSTIN: {selectedCustomer.gstin}</p>
                <p>{selectedCustomer.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No customer selected</p>
          )}
        </div>
        
        <div>
          <p className="text-gray-500 uppercase text-sm">Invoice Date</p>
          <p className="mt-1">{new Date(formData.invoiceDate).toLocaleDateString()}</p>
        </div>
        
        <div>
          <p className="text-gray-500 uppercase text-sm">Due Date</p>
          <p className="mt-1">{new Date(formData.dueDate).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="mt-4 p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-gray-500 uppercase text-sm">Description</th>
              <th className="text-right py-3 text-gray-500 uppercase text-sm">Qty</th>
              <th className="text-right py-3 text-gray-500 uppercase text-sm">Price</th>
              <th className="text-right py-3 text-gray-500 uppercase text-sm">Tax</th>
              <th className="text-right py-3 text-gray-500 uppercase text-sm">Amount</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-4">
                  <div>{item.description || "Product description"}</div>
                </td>
                <td className="text-right py-4">{item.quantity} {item.unit}</td>
                <td className="text-right py-4">₹{item.price.toFixed(2)}</td>
                <td className="text-right py-4">{item.tax}%</td>
                <td className="text-right py-4">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-gray-50 p-6 flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{formData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-sm border-b border-gray-200">
            <span className="text-gray-600">Tax</span>
            <span>₹{formData.taxTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 font-semibold">
            <span>Total</span>
            <span>₹{formData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {formData.notes && (
        <div className="p-6 border-t border-gray-100">
          <p className="text-gray-500 uppercase text-sm mb-2">Notes</p>
          <p className="text-sm">{formData.notes}</p>
        </div>
      )}
      
      <div className="bg-primary/10 p-6 text-center">
        <p className="text-sm">Thank you for your business!</p>
      </div>
    </div>
  );

  // Professional Template Preview
  const ProfessionalTemplatePreview = () => (
    <div className="border rounded-md p-8 bg-white text-black">
      <div className="flex justify-between items-start border-b border-gray-200 pb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Company Name</h1>
          <div className="text-sm mt-2 text-gray-600">
            <p>Company Address Line 1</p>
            <p>City, State, ZIP</p>
            <p>GSTIN: 12ABCDE1234F1Z5</p>
            <p>contact@yourcompany.com</p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-block border border-gray-300 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">INVOICE</h2>
            <div className="text-sm">
              <p><span className="text-gray-600">Invoice #:</span> {formData.invoiceNumber}</p>
              <p><span className="text-gray-600">Date:</span> {new Date(formData.invoiceDate).toLocaleDateString()}</p>
              <p><span className="text-gray-600">Due Date:</span> {new Date(formData.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-gray-600 font-medium mb-3">BILL TO</h3>
        {selectedCustomer ? (
          <div>
            <p className="font-semibold">{selectedCustomer.name}</p>
            <div className="text-sm mt-1">
              <p>{selectedCustomer.address}</p>
              <p><span className="text-gray-600">GSTIN:</span> {selectedCustomer.gstin}</p>
              <p>{selectedCustomer.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No customer selected</p>
        )}
      </div>
      
      <div className="mt-8">
        <div className="bg-gray-100 border border-gray-300">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Item & Description</th>
                <th className="text-center py-3 px-4 text-gray-700 font-semibold">Qty</th>
                <th className="text-right py-3 px-4 text-gray-700 font-semibold">Unit Price</th>
                <th className="text-right py-3 px-4 text-gray-700 font-semibold">Tax</th>
                <th className="text-right py-3 px-4 text-gray-700 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-300">
                  <td className="py-3 px-4">
                    <div className="font-medium">{item.description || "Product description"}</div>
                  </td>
                  <td className="text-center py-3 px-4">{item.quantity} {item.unit}</td>
                  <td className="text-right py-3 px-4">₹{item.price.toFixed(2)}</td>
                  <td className="text-right py-3 px-4">{item.tax}%</td>
                  <td className="text-right py-3 px-4">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <div className="w-1/3 border-t border-gray-300">
          <div className="flex justify-between py-2 px-4">
            <span className="text-gray-600">Subtotal:</span>
            <span>₹{formData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 px-4 border-b border-gray-300">
            <span className="text-gray-600">Tax Amount:</span>
            <span>₹{formData.taxTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 px-4 font-bold bg-gray-100">
            <span>Total:</span>
            <span>₹{formData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {formData.notes && (
        <div className="mt-8 border-t border-gray-200 pt-4">
          <h3 className="text-gray-600 font-medium mb-2">NOTES</h3>
          <p className="text-sm">{formData.notes}</p>
        </div>
      )}
      
      <div className="mt-8 text-center border-t border-gray-200 pt-4">
        <p className="text-gray-600">Payment Terms: {paymentTermsOptions.find(pt => pt.value === formData.paymentTerms)?.label}</p>
        <p className="mt-2 font-medium">Thank you for your business!</p>
      </div>
    </div>
  );

  // Main Form UI
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Create New Invoice</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={handlePreviewToggle}
            >
              {previewMode ? (
                <>
                  <X className="h-4 w-4" />
                  Close Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={generatePDF}
            >
              <FileDown className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {previewMode ? (
          // Preview Mode
          <div className="mb-6">
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(false)}
              >
                Back to Edit
              </Button>
            </div>
            
            {selectedTemplate === "classic" && <ClassicTemplatePreview />}
            {selectedTemplate === "modern" && <ModernTemplatePreview />}
            {selectedTemplate === "professional" && <ProfessionalTemplatePreview />}
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
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
                        <div className="flex gap-2">
                          <select
                            id="customerId"
                            name="customerId"
                            value={formData.customerId}
                            onChange={handleChange}
                            className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                            required
                          >
                            <option value="">Select a customer</option>
                            {mockCustomers.map((customer) => (
                              <option key={customer.id} value={customer.id}>
                                {customer.name}
                              </option>
                            ))}
                          </select>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => router.push('/sales/customers/new')}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
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

                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>Invoice Items</CardTitle>
                        <CardDescription>Products or services in this invoice</CardDescription>
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
                          <p className="text-muted-foreground">No items added yet. Click 'Add Item' to begin.</p>
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
                                <div className="flex gap-2">
                                  <select
                                    id={`item-product-${index}`}
                                    value={item.productId}
                                    onChange={(e) => handleItemChange(item.id, 'productId', e.target.value)}
                                    className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                                    required
                                  >
                                    <option value="">Select a product</option>
                                    {mockProducts.map((product) => (
                                      <option key={product.id} value={product.id}>
                                        {product.name} ({product.code})
                                      </option>
                                    ))}
                                  </select>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => router.push('/inventory/products/new')}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
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
                            
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mt-4">
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
                                  className="w-full rounded-md border border-input bg-background px-3 py-2"
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
                        <div className="flex justify-between py-2 border-t border-t-2">
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
                        placeholder="Any additional information or terms"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Template</CardTitle>
                    <CardDescription>
                      Select a layout for your invoice
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {invoiceTemplates.map((template) => (
                        <div 
                          key={template.id} 
                          className={`border rounded-md p-4 cursor-pointer transition-all ${
                            selectedTemplate === template.id 
                              ? "border-primary bg-primary/5" 
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => handleTemplateChange(template.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{template.name}</p>
                              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                            </div>
                            {selectedTemplate === template.id && (
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-white">
                                <Check size={12} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
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
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard size={16} className="text-muted-foreground" />
                        <p className="text-sm font-medium">Payment Terms</p>
                      </div>
                      <p className="text-sm">
                        {paymentTermsOptions.find(pt => pt.value === formData.paymentTerms)?.label}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar size={16} className="text-muted-foreground" />
                        <p className="text-sm font-medium">Due Date</p>
                      </div>
                      <p className="text-sm">
                        {new Date(formData.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-4">
                    <Button
                      variant="outline"
                      onClick={() => router.push('/sales/invoices')}
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
                      {isSubmitting ? "Saving..." : "Save Invoice"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}