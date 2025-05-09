"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  FileDown,
  Printer,
  Truck, 
  ShoppingBag,
  Calendar,
  CreditCard,
  User,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent} from "@/components/ui/card";

// Mock order data
const mockOrders = [
  {
    id: "ord1",
    orderNumber: "ORD-2025-0001",
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
    expectedShipDate: "2025-05-08",
    shippingMethod: "Standard Shipping",
    paymentTerms: "Net 30 Days",
    shippingAddress: "123 Main St, New York, NY 10001",
    billingAddress: "123 Main St, New York, NY 10001",
    amount: 12450.00,
    status: "DELIVERED",
    items: [
      { 
        id: "item1", 
        productId: "prod1",
        description: "Steel Bolts (10mm)",
        code: "STL-B10", 
        quantity: 200, 
        unit: "PIECE", 
        price: 25.00, 
        tax: 18,
        amount: 5000.00
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
    subtotal: 11037.50,
    taxTotal: 1412.50,
    total: 12450.00,
    notes: "Please deliver to main entrance. Call before delivery.",
    trackingNumber: "TRK12345678",
    deliveryDate: "2025-05-07"
  },
  {
    id: "ord2",
    orderNumber: "ORD-2025-0002",
    customer: "TechSolutions Inc",
    customerDetails: {
      name: "TechSolutions Inc",
      contactPerson: "Alice Johnson",
      email: "accounts@techsolutions.com", 
      phone: "+91 9876543211",
      address: "456 Park Ave, San Francisco, CA 94102",
      gstin: "27FGHIJ5678K1Z3"
    },
    date: "2025-05-03",
    expectedShipDate: "2025-05-10",
    shippingMethod: "Express Shipping",
    paymentTerms: "Net 15 Days",
    shippingAddress: "456 Park Ave, San Francisco, CA 94102",
    billingAddress: "456 Park Ave, San Francisco, CA 94102",
    amount: 5680.25,
    status: "CONFIRMED",
    items: [
      { 
        id: "item3", 
        productId: "prod2",
        description: "Aluminum Sheet (2mm)",
        code: "ALU-S2", 
        quantity: 30, 
        unit: "KG", 
        price: 175.50, 
        tax: 18,
        amount: 5265.00
      },
      {
        id: "item4",
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
    subtotal: 5625.00,
    taxTotal: 55.25,
    total: 5680.25,
    notes: "Leave with security if no one answers.",
    trackingNumber: "",
    deliveryDate: ""
  },
  {
    id: "ord3",
    orderNumber: "ORD-2025-0003",
    customer: "Global Manufacturing Ltd",
    customerDetails: {
      name: "Global Manufacturing Ltd",
      contactPerson: "David Williams",
      email: "finance@globalmanufacturing.com", 
      phone: "+91 9876543212",
      address: "789 Industry Blvd, Chicago, IL 60007",
      gstin: "24KLMNO9012P1Z8"
    },
    date: "2025-05-04",
    expectedShipDate: "2025-05-11",
    shippingMethod: "Standard Shipping",
    paymentTerms: "Net 30 Days",
    shippingAddress: "789 Industry Blvd, Chicago, IL 60007",
    billingAddress: "789 Industry Blvd, Chicago, IL 60007",
    amount: 8970.50,
    status: "PACKED",
    items: [
      { 
        id: "item5", 
        productId: "prod4",
        description: "Circuit Board X1",
        code: "CBX-001", 
        quantity: 25, 
        unit: "PIECE", 
        price: 350.25, 
        tax: 18,
        amount: 8756.25
      },
    ],
    subtotal: 8756.25,
    taxTotal: 214.25,
    total: 8970.50,
    notes: "Fragile items. Handle with care.",
    trackingNumber: "",
    deliveryDate: ""
  },
  {
    id: "ord4",
    orderNumber: "ORD-2025-0004",
    customer: "XYZ Industries",
    customerDetails: {
      name: "XYZ Industries",
      contactPerson: "Sarah Brown",
      email: "ap@xyzindustries.com", 
      phone: "+91 9876543213",
      address: "101 Commerce Dr, Austin, TX 78701",
      gstin: "07PQRST3456U1Z6"
    },
    date: "2025-05-06",
    expectedShipDate: "2025-05-13",
    shippingMethod: "Customer Pickup",
    paymentTerms: "Due on Receipt",
    shippingAddress: "101 Commerce Dr, Austin, TX 78701",
    billingAddress: "101 Commerce Dr, Austin, TX 78701",
    amount: 3245.75,
    status: "SHIPPED",
    items: [
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
      },
      {
        id: "item7",
        productId: "prod3",
        description: "Plastic Housing Type B",
        code: "PLT-HB",
        quantity: 15,
        unit: "PIECE",
        price: 120.75,
        tax: 12,
        amount: 1811.25
      }
    ],
    subtotal: 3061.25,
    taxTotal: 184.50,
    total: 3245.75,
    notes: "Customer will pick up from warehouse.",
    trackingNumber: "TRK98765432",
    deliveryDate: ""
  },
  {
    id: "ord5",
    orderNumber: "ORD-2025-0005",
    customer: "ABC Enterprises",
    customerDetails: {
      name: "ABC Enterprises",
      contactPerson: "Michael Lee",
      email: "payments@abcent.com", 
      phone: "+91 9876543214",
      address: "202 Business Pkwy, Miami, FL 33125",
      gstin: "33UVWXY7890Z1Z1"
    },
    date: "2025-05-07",
    expectedShipDate: "2025-05-14",
    shippingMethod: "Standard Shipping",
    paymentTerms: "Net 15 Days",
    shippingAddress: "202 Business Pkwy, Miami, FL 33125",
    billingAddress: "202 Business Pkwy, Miami, FL 33125",
    amount: 6780.00,
    status: "DRAFT",
    items: [
      { 
        id: "item8", 
        productId: "prod2",
        description: "Aluminum Sheet (2mm)",
        code: "ALU-S2", 
        quantity: 35, 
        unit: "KG", 
        price: 175.50, 
        tax: 18,
        amount: 6142.50
      },
      {
        id: "item9",
        productId: "prod5",
        description: "LED Bulbs 5W",
        code: "LED-B5W",
        quantity: 12,
        unit: "PIECE",
        price: 45.00,
        tax: 12,
        amount: 540.00
      }
    ],
    subtotal: 6682.50,
    taxTotal: 97.50,
    total: 6780.00,
    notes: "Awaiting final approval from purchasing.",
    trackingNumber: "",
    deliveryDate: ""
  }
];

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
// Define Order type for better type safety
interface OrderItem {
    id: string;
    productId: string;
    description: string;
    code: string;
    quantity: number;
    unit: string;
    price: number;
    tax: number;
    amount: number;
}

interface CustomerDetails {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    gstin: string;
}

interface Order {
    id: string;
    orderNumber: string;
    customer: string;
    customerDetails: CustomerDetails;
    date: string;
    expectedShipDate: string;
    shippingMethod: string;
    paymentTerms: string;
    shippingAddress: string;
    billingAddress: string;
    amount: number;
    status: string;
    items: OrderItem[];
    subtotal: number;
    taxTotal: number;
    total: number;
    notes?: string;
    trackingNumber?: string;
    deliveryDate?: string;
}

const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
  } | null>(null);
  
  useEffect(() => {
    // Simulate API call to get order details
    const fetchOrderDetails = () => {
      setLoading(true);
      
      // Find the order with the matching id
      const foundOrder = mockOrders.find(o => o.id === id);
      
      if (foundOrder) {
        setOrder(foundOrder);
      }
      
      setLoading(false);
    };
    
    fetchOrderDetails();
  }, [id]);

  const handlePrint = () => {
    setModalContent({
      title: "Demo Mode",
      message: `In a real application, this would print the order details for ${order?.orderNumber}.`,
      type: "info"
    });
    setShowModal(true);
  };

  const handleExport = () => {
    setModalContent({
      title: "Demo Mode",
      message: `In a real application, this would export ${order?.orderNumber} to a PDF file.`,
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
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500";
      case "PACKED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500";
      case "PICKING":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500";
      case "CONFIRMED":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-500";
      case "DRAFT":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">The order you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
        <Button onClick={() => router.push("/sales/orders")}>
          Return to Orders
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
              <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
              <p className="text-muted-foreground text-sm">Created on {new Date(order.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
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
            <Button 
              onClick={() => router.push("/sales/orders/new")}
              className="flex items-center gap-1"
            >
              Create New Order
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-md border p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8">
            <div className="md:w-1/2">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">Order Status</h3>
                  <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">Shipping Method</h3>
                  <p className="text-muted-foreground text-sm mt-1">{order.shippingMethod}</p>
                  {order.trackingNumber && (
                    <p className="text-sm mt-1">Tracking #: {order.trackingNumber}</p>
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
                  <p className="font-medium">{order.customerDetails.name}</p>
                  <p className="text-sm text-muted-foreground">{order.customerDetails.contactPerson}</p>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <p>Email: {order.customerDetails.email}</p>
                <p>Phone: {order.customerDetails.phone}</p>
                <p>GSTIN: {order.customerDetails.gstin}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Shipping Address</p>
                  <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Expected Ship Date</p>
                  <p className="text-sm text-muted-foreground">{new Date(order.expectedShipDate).toLocaleDateString()}</p>
                  {order.deliveryDate && (
                    <>
                      <p className="font-medium mt-2">Delivered On</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                    </>
                  )}
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
                  <p className="text-sm text-muted-foreground">{order.paymentTerms}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div>
                  <p className="font-medium">Billing Address</p>
                  <p className="text-sm text-muted-foreground">{order.billingAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
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
                  {order.items.map((item) => (
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
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Tax:</span>
                  <span>₹{order.taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border border-t-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {order.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.notes}</p>
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