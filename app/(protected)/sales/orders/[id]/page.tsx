"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  AlertCircle, 
  Printer, 
  FileDown,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  ShoppingCart
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api-client";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: string;
    name: string;
    code: string;
  };
}

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

interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  status: 'DRAFT' | 'CONFIRMED' | 'PICKING' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get<Order>(`/sales/orders/${id}`);
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch order details');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    if (!order) return;
    
    setUpdateLoading(true);
    try {
      const response = await api.put<Order>(`/sales/orders/${id}`, {
        status: newStatus
      });
      
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        throw new Error(response.error || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      // You might want to show an error toast here
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'SHIPPED':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'PACKED':
        return <Package className="h-5 w-5 text-amber-500" />;
      default:
        return <ShoppingCart className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "CANCELLED":
        return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "DRAFT":
        return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "PICKING":
      case "PACKED":
      case "SHIPPED":
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
      default:
        return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => router.push("/sales/orders")}>
          Return to Orders
        </Button>
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
          <div>
            <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              Created on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {order.status === 'DRAFT' && (
            <Button 
              onClick={() => router.push(`/sales/orders/${id}/edit`)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit Order
            </Button>
          )}
          <Button variant="outline" className="flex items-center gap-1">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              {getStatusIcon(order.status)}
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            {order.status === 'DRAFT' && (
              <Button
                className="w-full"
                disabled={updateLoading}
                onClick={() => handleStatusUpdate('CONFIRMED')}
              >
                Confirm Order
              </Button>
            )}
            {order.status === 'CONFIRMED' && (
              <Button
                className="w-full"
                disabled={updateLoading}
                onClick={() => handleStatusUpdate('PICKING')}
              >
                Start Picking
              </Button>
            )}
            {/* Add more status transition buttons as needed */}
          </CardContent>
        </Card>

        {/* Customer Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Name</dt>
                <dd className="font-medium">{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd>{order.customer.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Phone</dt>
                <dd>{order.customer.phone}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Address</dt>
                <dd className="text-sm">
                  {order.customer.address}<br />
                  {order.customer.city}, {order.customer.state} {order.customer.pincode}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Order Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Total Items</dt>
                <dd className="font-medium">{order.items.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Total Amount</dt>
                <dd className="font-medium">₹{order.totalAmount.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">SKU</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Quantity</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Unit Price</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="font-medium">{item.product.name}</div>
                    </td>
                    <td className="py-3 px-4 text-sm">{item.product.code}</td>
                    <td className="py-3 px-4 text-right">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">₹{item.unitPrice.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</td>
                    <td className="py-3 px-4 text-right">₹{item.totalPrice.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}