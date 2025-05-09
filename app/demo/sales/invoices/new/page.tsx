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
  const ClassicTemplatePreview = () => (
    <div className="border rounded-md p-8 bg-white text-black">
      <div className="bg-blue-50 -m-8 p-8 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">INVOICE</h1>
            <div className="text-sm mt-4 text-blue-900">
              <p className="font-bold">Your Company Name</p>
              <p>Company Address Line 1</p>
              <p>City, State, ZIP</p>
              <p>GSTIN: 12ABCDE1234F1Z5</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-blue-800"># {formData.invoiceNumber}</p>
            <p className="mt-2 text-blue-900">Invoice Date: {new Date(formData.invoiceDate).toLocaleDateString()}</p>
            <p className="text-blue-900">Due Date: {new Date(formData.dueDate).toLocaleDateString()}</p>
          </div>
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
            {formData.items.map((item) => (
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
    <div className="border rounded-md overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 text-black">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
          <p className="text-xl font-medium bg-white/20 px-4 py-2 rounded-lg"># {formData.invoiceNumber}</p>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Your Company Name</h1>
            <div className="text-sm mt-2">
              <p>Company Address Line 1</p>
              <p>City, State, ZIP</p>
              <p>GSTIN: 12ABCDE1234F1Z5</p>
              <p>contact@yourcompany.com</p>
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
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-gray-500 uppercase text-sm">Description</th>
                <th className="text-right py-3 text-gray-500 uppercase text-sm">Qty</th>
                <th className="text-right py-3 text-gray-500 uppercase text-sm">Price</th>
                <th className="text-right py-3 text-gray-500 uppercase text-sm">Tax</th>
                <th className="text-right py-3 text-gray-500 uppercase text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item) => (
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
    </div>
  );

  // Professional Template Preview
  const ProfessionalTemplatePreview = () => (
    <div className="border rounded-md p-8 bg-white text-black">
      <div className="flex justify-between items-start border-b-2 border-navy-800 pb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Your Company Name</h1>
          <div className="text-sm mt-2 text-navy-700">
            <p>Company Address Line 1</p>
            <p>City, State, ZIP</p>
            <p>GSTIN: 12ABCDE1234F1Z5</p>
            <p>contact@yourcompany.com</p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-block border-2 border-navy-200 p-4 rounded bg-navy-50">
            <h2 className="text-xl font-semibold mb-2 text-navy-800">INVOICE</h2>
            <div className="text-sm">
              <p><span className="text-navy-600">Invoice #:</span> {formData.invoiceNumber}</p>
              <p><span className="text-navy-600">Date:</span> {new Date(formData.invoiceDate).toLocaleDateString()}</p>
              <p><span className="text-navy-600">Due:</span> {new Date(formData.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-gray-600 font-medium mb-3">BILL TO</h3>
        {selectedCustomer ? (
          <div>
            <p className="font-semibold">{selectedCustomer.name}</p>
            <div className="mt-1 text-sm">
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
              {formData.items.map((item) => (
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

  // Minimal Template Preview
  const MinimalTemplatePreview = () => (
    <div className="border rounded-md p-8 bg-white text-black">
      <div className="flex justify-between items-start border-b border-gray-200 pb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight">INVOICE</h1>
          <div className="text-sm mt-6 space-y-1">
            <p className="font-medium">Your Company Name</p>
            <p className="text-gray-600">Company Address Line 1</p>
            <p className="text-gray-600">City, State, ZIP</p>
            <p className="text-gray-600">GSTIN: 12ABCDE1234F1Z5</p>
          </div>
        </div>
        <div>
          <p className="text-right text-sm text-gray-500 mb-1">Invoice Number</p>
          <p className="text-xl font-light">{formData.invoiceNumber}</p>
          <div className="mt-4">
            <p className="text-right text-sm text-gray-500 mb-1">Date</p>
            <p>{new Date(formData.invoiceDate).toLocaleDateString()}</p>
          </div>
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
            {formData.items.map((item) => (
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

  // Elegant Template Preview
  const ElegantTemplatePreview = () => (
    <div className="border rounded-md bg-gradient-to-br from-emerald-50 to-white text-black">
      <div className="border-b border-emerald-200">
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-serif text-emerald-900">Your Company Name</h1>
              <div className="text-sm mt-2 text-emerald-800">
                <p>Company Address Line 1</p>
                <p>City, State, ZIP</p>
                <p>GSTIN: 12ABCDE1234F1Z5</p>
                <p>contact@yourcompany.com</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-serif text-emerald-900 mb-2">INVOICE</h2>
                <div className="text-sm">
                  <p><span className="text-emerald-700">No:</span> {formData.invoiceNumber}</p>
                  <p><span className="text-emerald-700">Date:</span> {new Date(formData.invoiceDate).toLocaleDateString()}</p>
                  <p><span className="text-emerald-700">Due:</span> {new Date(formData.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4">
        <h3 className="text-gray-600 font-medium mb-3">BILL TO</h3>
        {selectedCustomer ? (
          <div>
            <p className="font-semibold">{selectedCustomer.name}</p>
            <div className="mt-1 text-sm">
              <p>{selectedCustomer.address}</p>
              <p><span className="text-gray-600">GSTIN:</span> {selectedCustomer.gstin}</p>
              <p>{selectedCustomer.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No customer selected</p>
        )}
      </div>
      
      <div className="mt-8 p-4">
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
              {formData.items.map((item) => (
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

  // Corporate Template Preview
  const CorporateTemplatePreview = () => (
    <div className="border rounded-md bg-white text-black">
      <div className="bg-blue-900 text-white p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Your Company Name</h1>
            <div className="text-sm mt-2 text-blue-200">
              <p>Company Address Line 1</p>
              <p>City, State, ZIP</p>
              <p>GSTIN: 12ABCDE1234F1Z5</p>
              <p>contact@yourcompany.com</p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block bg-white text-blue-900 p-4 rounded">
              <h2 className="text-xl font-bold mb-2">INVOICE</h2>
              <div className="text-sm">
                <p><span className="text-blue-700">Invoice #:</span> {formData.invoiceNumber}</p>
                <p><span className="text-blue-700">Date:</span> {new Date(formData.invoiceDate).toLocaleDateString()}</p>
                <p><span className="text-blue-700">Due:</span> {new Date(formData.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4">
        <h3 className="text-gray-600 font-medium mb-3">BILL TO</h3>
        {selectedCustomer ? (
          <div>
            <p className="font-semibold">{selectedCustomer.name}</p>
            <div className="mt-1 text-sm">
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
              {formData.items.map((item) => (
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

  // Creative Template Preview
  const CreativeTemplatePreview = () => (
    <div className="border rounded-md overflow-hidden bg-gradient-to-br from-purple-100 via-white to-purple-50 text-black">
      <div className="bg-gradient-to-r from-purple-600 to-purple-900 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)] pointer-events-none"></div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-100 to-white">Your Company Name</h1>
            <div className="text-sm mt-2 text-purple-200">
              <p>Company Address Line 1</p>
              <p>City, State, ZIP</p>
              <p>GSTIN: 12ABCDE1234F1Z5</p>
              <p>contact@yourcompany.com</p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <h2 className="text-xl font-bold mb-2">INVOICE</h2>
              <div className="text-sm">
                <p>No: {formData.invoiceNumber}</p>
                <p>Date: {new Date(formData.invoiceDate).toLocaleDateString()}</p>
                <p>Due: {new Date(formData.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Your Company Name</h1>
            <div className="text-sm mt-2">
              <p>Company Address Line 1</p>
              <p>City, State, ZIP</p>
              <p>GSTIN: 12ABCDE1234F1Z5</p>
              <p>contact@yourcompany.com</p>
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
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-gray-500 uppercase text-sm">Description</th>
                <th className="text-right py-3 text-gray-500 uppercase text-sm">Qty</th>
                <th className="text-right py-3 text-gray-500 uppercase text-sm">Price</th>
                <th className="text-right py-3 text-gray-500 uppercase text-sm">Tax</th>
                <th className="text-right py-3 text-gray-500 uppercase text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item) => (
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
    </div>
  );

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