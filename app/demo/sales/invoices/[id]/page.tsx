"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  FileDown,
  Printer,
  Calendar,
  CreditCard,
  User,
  AlertCircle,
  Receipt,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent} from "@/components/ui/card";

// Mock invoices data
const mockInvoices = [
  { 
    id: "inv1", 
    invoiceNumber: "INV-2025-0001", 
    customer: "Acme Corporation",
    customerDetails: {
      name: "Acme Corporation",
      contactPerson: "John Smith",
      email: "billing@acme.com", 
      phone: "+91 9876543210",
      address: "123 Main St, New York, NY 10001",
      gstin: "29ABCDE1234F1Z5"
    },
    date: "2025-05-01",
    dueDate: "2025-05-31",
    paymentTerms: "Net 30 Days",
    billingAddress: "123 Main St, New York, NY 10001",
    amount: 12500.00,
    status: "PAID",
    paidDate: "2025-05-15",
    paymentMethod: "Bank Transfer",
    paymentReference: "ACM2025001",
    items: [
      { 
        id: "item1", 
        productId: "prod1",
        description: "Steel Bolts (10mm)",
        code: "STL-B10", 
        quantity: 250, 
        unit: "PIECE", 
        price: 25.00, 
        tax: 18,
        amount: 6250.00
      },
      {
        id: "item2",
        productId: "prod3",
        description: "Plastic Housing Type B",
        code: "PLT-HB",
        quantity: 50,
        unit: "PIECE",
        price: 120.75,
        tax: 12,
        amount: 6037.50
      }
    ],
    subtotal: 12287.50,
    taxTotal: 212.50,
    total: 12500.00,
    notes: "Thank you for your business."
  },
  { 
    id: "inv2", 
    invoiceNumber: "INV-2025-0002", 
    customer: "TechSolutions Inc",
    customerDetails: {
      name: "TechSolutions Inc",
      contactPerson: "Alice Johnson",
      email: "accounts@techsolutions.com", 
      phone: "+91 9876543211",
      address: "456 Park Ave, San Francisco, CA 94102",
      gstin: "27FGHIJ5678K1Z3"
    },
    date: "2025-05-02",
    dueDate: "2025-06-01",
    paymentTerms: "Net 30 Days",
    billingAddress: "456 Park Ave, San Francisco, CA 94102",
    amount: 8750.50,
    status: "PENDING",
    paidDate: "",
    paymentMethod: "",
    paymentReference: "",
    items: [
      { 
        id: "item3", 
        productId: "prod2",
        description: "Aluminum Sheet (2mm)",
        code: "ALU-S2", 
        quantity: 40, 
        unit: "KG", 
        price: 175.50, 
        tax: 18,
        amount: 7020.00
      },
      {
        id: "item4",
        productId: "prod5",
        description: "LED Bulbs 5W",
        code: "LED-B5W",
        quantity: 35,
        unit: "PIECE",
        price: 45.00,
        tax: 12,
        amount: 1575.00
      }
    ],
    subtotal: 8595.00,
    taxTotal: 155.50,
    total: 8750.50,
    notes: "Please make payment by due date."
  },
  { 
    id: "inv3", 
    invoiceNumber: "INV-2025-0003", 
    customer: "Global Manufacturing Ltd",
    customerDetails: {
      name: "Global Manufacturing Ltd",
      contactPerson: "David Williams",
      email: "finance@globalmanufacturing.com", 
      phone: "+91 9876543212",
      address: "789 Industry Blvd, Chicago, IL 60007",
      gstin: "24KLMNO9012P1Z8"
    },
    date: "2025-05-03",
    dueDate: "2025-05-17",
    paymentTerms: "Net 15 Days",
    billingAddress: "789 Industry Blvd, Chicago, IL 60007",
    amount: 22350.75,
    status: "PENDING",
    paidDate: "",
    paymentMethod: "",
    paymentReference: "",
    items: [
      { 
        id: "item5", 
        productId: "prod4",
        description: "Circuit Board X1",
        code: "CBX-001", 
        quantity: 60, 
        unit: "PIECE", 
        price: 350.25, 
        tax: 18,
        amount: 21015.00
      },
      {
        id: "item6",
        productId: "prod1",
        description: "Steel Bolts (10mm)",
        code: "STL-B10",
        quantity: 50,
        unit: "PIECE",
        price: 25.00,
        tax: 18,
        amount: 1250.00
      }
    ],
    subtotal: 22265.00,
    taxTotal: 85.75,
    total: 22350.75,
    notes: "Invoice due on May 17, 2025."
  },
  { 
    id: "inv4", 
    invoiceNumber: "INV-2025-0004", 
    customer: "XYZ Industries",
    customerDetails: {
      name: "XYZ Industries",
      contactPerson: "Sarah Brown",
      email: "ap@xyzindustries.com", 
      phone: "+91 9876543213",
      address: "101 Commerce Dr, Austin, TX 78701",
      gstin: "07PQRST3456U1Z6"
    },
    date: "2025-04-20",
    dueDate: "2025-05-05",
    paymentTerms: "Net 15 Days",
    billingAddress: "101 Commerce Dr, Austin, TX 78701",
    amount: 5250.25,
    status: "OVERDUE",
    paidDate: "",
    paymentMethod: "",
    paymentReference: "",
    items: [
      { 
        id: "item7", 
        productId: "prod3",
        description: "Plastic Housing Type B",
        code: "PLT-HB", 
        quantity: 40, 
        unit: "PIECE", 
        price: 120.75, 
        tax: 12,
        amount: 4830.00
      },
      {
        id: "item8",
        productId: "prod5",
        description: "LED Bulbs 5W",
        code: "LED-B5W",
        quantity: 8,
        unit: "PIECE",
        price: 45.00,
        tax: 12,
        amount: 360.00
      }
    ],
    subtotal: 5190.00,
    taxTotal: 60.25,
    total: 5250.25,
    notes: "Payment overdue. Please remit immediately."
  },
  { 
    id: "inv5", 
    invoiceNumber: "INV-2025-0005", 
    customer: "ABC Enterprises",
    customerDetails: {
      name: "ABC Enterprises",
      contactPerson: "Michael Lee",
      email: "payments@abcent.com", 
      phone: "+91 9876543214",
      address: "202 Business Pkwy, Miami, FL 33125",
      gstin: "33UVWXY7890Z1Z1"
    },
    date: "2025-04-15",
    dueDate: "2025-04-30",
    paymentTerms: "Net 15 Days",
    billingAddress: "202 Business Pkwy, Miami, FL 33125",
    amount: 9800.00,
    status: "PAID",
    paidDate: "2025-04-28",
    paymentMethod: "Credit Card",
    paymentReference: "ABC2025002",
    items: [
      { 
        id: "item9", 
        productId: "prod2",
        description: "Aluminum Sheet (2mm)",
        code: "ALU-S2", 
        quantity: 50, 
        unit: "KG", 
        price: 175.50, 
        tax: 18,
        amount: 8775.00
      },
      {
        id: "item10",
        productId: "prod1",
        description: "Steel Bolts (10mm)",
        code: "STL-B10",
        quantity: 40,
        unit: "PIECE",
        price: 25.00,
        tax: 18,
        amount: 1000.00
      }
    ],
    subtotal: 9775.00,
    taxTotal: 25.00,
    total: 9800.00,
    notes: "Thank you for your prompt payment."
  }
];

export default function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
type InvoiceItem = {
    id: string;
    productId: string;
    description: string;
    code: string;
    quantity: number;
    unit: string;
    price: number;
    tax: number;
    amount: number;
};

type CustomerDetails = {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    gstin: string;
};

type Invoice = {
    id: string;
    invoiceNumber: string;
    customer: string;
    customerDetails: CustomerDetails;
    date: string;
    dueDate: string;
    paymentTerms: string;
    billingAddress: string;
    amount: number;
    status: 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';
    paidDate: string;
    paymentMethod: string;
    paymentReference: string;
    items: InvoiceItem[];
    subtotal: number;
    taxTotal: number;
    total: number;
    notes: string;
};

const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
  } | null>(null);
  
  useEffect(() => {
    // Simulate API call to get invoice details
    const fetchInvoiceDetails = () => {
      setLoading(true);
      
      // Find the invoice with the matching id
      const foundInvoice = mockInvoices.find(inv => inv.id === id);
      
      if (foundInvoice) {
        // Type assertion to ensure the invoice status matches the expected type
        setInvoice(foundInvoice as Invoice);
      }
      
      setLoading(false);
    };
    
    fetchInvoiceDetails();
  }, [id]);

  const handlePrint = () => {
    setModalContent({
      title: "Demo Mode",
      message: `In a real application, this would print the invoice ${invoice?.invoiceNumber}.`,
      type: "info"
    });
    setShowModal(true);
  };

  const handleExport = () => {
    setModalContent({
      title: "Demo Mode",
      message: `In a real application, this would export ${invoice?.invoiceNumber} to a PDF file.`,
      type: "info"
    });
    setShowModal(true);
  };

  const handleSendEmail = () => {
    setModalContent({
      title: "Demo Mode",
      message: `In a real application, this would send ${invoice?.invoiceNumber} to the customer via email.`,
      type: "info"
    });
    setShowModal(true);
  };

  // Close modal handler
  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "PAID": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-blue-100 text-blue-800";
      case "OVERDUE": return "bg-red-100 text-red-800";
      case "CANCELLED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold mb-2">Invoice Not Found</h2>
        <p className="text-muted-foreground mb-4">The invoice you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
        <Button onClick={() => router.push("/sales/invoices")}>
          Return to Invoices
        </Button>
      </div>
    );
  }

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
            <div>
              <h1 className="text-2xl font-bold">Invoice {invoice.invoiceNumber}</h1>
              <p className="text-muted-foreground text-sm">Created on {new Date(invoice.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleSendEmail}
            >
              Email
            </Button>
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
              onClick={handleExport}
            >
              <FileDown className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-md border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8">
            <div className="md:w-1/2">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">Invoice Status</h3>
                  <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">Due Date</h3>
                  <p className="text-muted-foreground text-sm mt-1">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                  {invoice.paidDate && (
                    <p className="text-sm mt-1 text-green-600">Paid on {new Date(invoice.paidDate).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{invoice.customerDetails.name}</p>
                  <p className="text-sm text-muted-foreground">{invoice.customerDetails.contactPerson}</p>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <p>Email: {invoice.customerDetails.email}</p>
                <p>Phone: {invoice.customerDetails.phone}</p>
                <p>GSTIN: {invoice.customerDetails.gstin}</p>
              </div>
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div>
                  <p className="font-medium">Billing Address</p>
                  <p className="text-sm text-muted-foreground">{invoice.billingAddress}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Invoice Date</p>
                  <p className="text-sm text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Payment Terms</p>
                  <p className="text-sm text-muted-foreground">{invoice.paymentTerms}</p>
                </div>
              </div>
              
              {invoice.status === "PAID" && (
                <>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Payment Method</p>
                      <p className="text-sm text-muted-foreground">{invoice.paymentMethod}</p>
                      <p className="text-sm mt-1">Reference: {invoice.paymentReference}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">Item</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">Product Code</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">Quantity</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">Price</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">Tax</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-border">
                      <td className="py-3 px-4">
                        <div className="font-medium">{item.description}</div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{item.code}</td>
                      <td className="py-3 px-4 text-right">{item.quantity} {item.unit}</td>
                      <td className="py-3 px-4 text-right">₹{item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">{item.tax}%</td>
                      <td className="py-3 px-4 text-right font-medium">₹{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <div className="w-full md:w-1/3">
                <div className="flex justify-between py-2 border-t">
                  <span className="font-medium">Subtotal:</span>
                  <span>₹{invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Tax:</span>
                  <span>₹{invoice.taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border border-t-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">₹{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {invoice.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{invoice.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Demo Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-md w-full shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className={
                  modalContent?.type === 'warning' ? 'text-amber-500' : 
                  modalContent?.type === 'success' ? 'text-green-500' : 
                  'text-blue-500'
                } />
                <h3 className="text-lg font-medium">{modalContent?.title}</h3>
              </div>
              <p className="mb-6">{modalContent?.message}</p>
              <div className="flex justify-end">
                <button
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}